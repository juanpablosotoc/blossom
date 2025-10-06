from fastapi import APIRouter, HTTPException
from starlette.responses import StreamingResponse
from sqlalchemy import select
from myAws import S3
from uuid import uuid4
import os
from myDependencies import AuthDep
from myOrm.models import Thread, Message, FileAttachment
from .utils import _extract_thread_id, sse_data
from .schema import CreateMessageRequest
from ..openai_client import openai_client
from ..config import Config
from myExceptions.service import ServiceError
from .layers import Accumulator, openai_raw_response, unprocessed_gutenberg_response, processed_gutenberg_response

messages_route = APIRouter(prefix="/messages", tags=["messages"])

# The streaming generator using Responses stream
async def create_message_gen_stream(
    user_db_session: AuthDep,
    request: CreateMessageRequest,
):
    user, db_session = user_db_session
    content = request.content
    thread_id = request.thread_id

    if not content or not content.strip():
        raise HTTPException(status_code=422, detail="content is required")

    # Find (or create) a thread for this user
    res = await db_session.execute(select(Thread).where(Thread.user_id == user.id))
    thread = res.scalar_one_or_none()
    if not thread:
        created = await openai_client.create_thread()
        openai_tid = _extract_thread_id(created)
        thread = Thread(openai_thread_id=openai_tid, user_id=user.id)
        db_session.add(thread)
        await db_session.flush()

    # Persist user's message
    user_msg = Message(
        thread_id=thread.openai_thread_id,
        type="user",
        content=content,
    )
    db_session.add(user_msg)
    await db_session.flush()  # ensure user_msg.id is available

    # First OpenAI call (raw model): STREAM → aggregate → save as unprocessed-info
    raw_accum = Accumulator()
    async for sse_data_text in openai_raw_response(content, raw_accum): yield sse_data_text
    
    llm_text = "".join(raw_accum.accum).strip()
    # Save unprocessed-info
    resp_msg = Message(
        thread_id=thread.openai_thread_id,
        type="unprocessed-info",
        content=llm_text,
    )
    db_session.add(resp_msg)
    await db_session.flush()

    for i in range(Config.GUTENBERG_RETRY_COUNT):
        # Second call (your Gutenberg model): STREAM → aggregate → save as unprocessed-gutenberg
        unprocessed_gutenberg_accum = Accumulator()
        async for sse_data_text in unprocessed_gutenberg_response(llm_text, unprocessed_gutenberg_accum): yield sse_data_text
        unprocessed_gutenberg_text = "".join(unprocessed_gutenberg_accum.accum).strip()

        unprocessed_gutenberg_msg = Message(
            thread_id=thread.openai_thread_id,
            type="unprocessed-gutenberg",
            content=unprocessed_gutenberg_text,
        )
        db_session.add(unprocessed_gutenberg_msg)
        await db_session.flush()

        # Local transform of Gutenberg → (processed_text, extra_attachments)
        processed_gutenberg_accum = Accumulator()
        try:
            async for sse_data_text in processed_gutenberg_response(unprocessed_gutenberg_text, processed_gutenberg_accum): yield sse_data_text
            break
        except ServiceError as e:
            # The xml of unprocessed_gutenberg_text is invalid
            # commit to db to inspect
            await db_session.commit()
            # Re-compute the unprocessed-gutenberg_text
            continue

    if i == Config.GUTENBERG_RETRY_COUNT - 1:
        # llm_text caused n errors in gutenberg
        # Save llm_text for inspection
        file_name = f"llm_text_error_{uuid4()}.txt"
        with open(file_name, 'w', encoding='utf-8') as f:
            f.write(llm_text)
        S3.upload_file(
            bucket_name=Config.AWS_BUCKET_NAME,
            object_name=file_name,
            file_path=file_name,
        )
        # remove the file
        os.remove(file_name)
        raise ServiceError("Failed to process the unprocessed-gutenberg_text")

    processed_text = "".join(processed_gutenberg_accum.accum).strip()

    processed_msg = Message(
        thread_id=thread.openai_thread_id,
        type="processed-gutenberg",
        content=processed_text,
    )
    db_session.add(processed_msg)
    await db_session.flush()

    # Persist any attachments produced by post-processing
    for fa in processed_gutenberg_accum.attachments:
        if isinstance(fa, FileAttachment):
            fa.message_id = processed_msg.id
            db_session.add(fa)
        else:
            url = getattr(fa, "file_url", None)
            if not url and isinstance(fa, dict):
                url = fa.get("file_url")
            if url:
                db_session.add(FileAttachment(message_id=processed_msg.id, file_url=url))

    await db_session.commit()

    # SSE terminator
    yield sse_data("[DONE]")

# Browser handles get sgtreams much better than post streams
@messages_route.get("/")
async def get_messages(
    user_db_session: AuthDep,
    question: str = None,
):
    if not question: raise HTTPException(status_code=422, detail="question is required")
    
    return StreamingResponse(create_message_gen_stream(user_db_session, CreateMessageRequest(content=question)), media_type="text/event-stream")
    
@messages_route.post("/")
async def create_message(
    user_db_session: AuthDep,
    request: CreateMessageRequest,
):
    return StreamingResponse(create_message_gen_stream(user_db_session, request), media_type="text/event-stream")
