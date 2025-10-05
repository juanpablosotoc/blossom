from fastapi import APIRouter, HTTPException
from starlette.responses import StreamingResponse
from sqlalchemy import select

from myDependencies import AuthDep
from myOrm.models import Thread, Message, FileAttachment
from .utils import _extract_thread_id, sse_data
from .schema import CreateMessageRequest
from ..openai_client import openai_client
from ..config import Config
from ..gutenberg import transform_gutenberg

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
    yield sse_data("[OPENAI_RAW_RESPONSE_START]")
    raw_accum = []
    async for delta in openai_client.responses_stream(
        model=Config.OPENAI_BASE_MODEL,
        input=content,
    ):
        raw_accum.append(delta)
        # stream deltas as they arrive; safe for newlines
        yield sse_data(delta)
    llm_text = "".join(raw_accum).strip()
    yield sse_data("[OPENAI_RAW_RESPONSE_END]")

    # Save unprocessed-info
    resp_msg = Message(
        thread_id=thread.openai_thread_id,
        type="unprocessed-info",
        content=llm_text,
    )
    db_session.add(resp_msg)
    await db_session.flush()

    # Second call (your Gutenberg model): STREAM → aggregate → save as unprocessed-gutenberg
    yield sse_data("[UNPROCESSED_GUTENBERG_START]")
    gut_accum = []
    async for delta in openai_client.responses_stream(
        model=Config.GUTENBERG_OPENAI_ENGINE_ID,
        input=[
            {"role": "system", "content": Config.GUTENBERG_SYSTEM_INSTRUCTIONS},
            {"role": "user", "content": llm_text},
        ],
    ):
        gut_accum.append(delta)
        yield sse_data(delta)
    unprocessed_gutenberg_text = "".join(gut_accum).strip()
    yield sse_data("[UNPROCESSED_GUTENBERG_END]")

    unprocessed_gutenberg_msg = Message(
        thread_id=thread.openai_thread_id,
        type="unprocessed-gutenberg",
        content=unprocessed_gutenberg_text,
    )
    db_session.add(unprocessed_gutenberg_msg)
    await db_session.flush()

    # Local transform of Gutenberg → (processed_text, extra_attachments)
    yield sse_data("[PROCESS_GUTENBERG_START]")
    processed_text, extra_attachments = await transform_gutenberg(unprocessed_gutenberg_text)
    yield sse_data(processed_text)
    yield sse_data("[PROCESS_GUTENBERG_END]")

    processed_msg = Message(
        thread_id=thread.openai_thread_id,
        type="processed-gutenberg",
        content=processed_text,
    )
    db_session.add(processed_msg)
    await db_session.flush()

    # Persist any attachments produced by post-processing
    for fa in extra_attachments:
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
