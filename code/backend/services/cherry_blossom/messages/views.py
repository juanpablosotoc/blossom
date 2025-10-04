import asyncio
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from starlette.responses import StreamingResponse
from typing import Optional, List
from sqlalchemy import select

from myDependencies import AuthDep
from myOrm.models import Thread, Message, FileAttachment, User
from .utils import process_file_attachments
from ..openai_client import openai_client
from ..config import Config
from ..gutenberg import transform_gutenberg

messages_route = APIRouter(prefix="/messages", tags=["messages"])


# ---------- helpers to normalize myOpenAI outputs ----------
def _extract_thread_id(created) -> str:
    if isinstance(created, str):
        return created
    tid = getattr(created, "id", None)
    if tid:
        return tid
    if isinstance(created, dict) and created.get("id"):
        return created["id"]
    raise HTTPException(status_code=500, detail="Failed to create thread id")

def _extract_text(obj) -> str:
    for attr in ("content", "output_text", "text"):
        val = getattr(obj, attr, None)
        if isinstance(val, str) and val.strip():
            return val
    if isinstance(obj, dict):
        for key in ("content", "output_text", "text"):
            val = obj.get(key)
            if isinstance(val, str) and val.strip():
                return val
        try:
            return obj["choices"][0]["message"]["content"]
        except Exception:
            pass
    if isinstance(obj, (list, tuple)) and obj and isinstance(obj[0], str):
        return obj[0]
    raise HTTPException(status_code=500, detail="Could not extract text from OpenAI response")
# ----------------------------------------------------------


@messages_route.post("/")
async def create_message(
    user_db_session: AuthDep,
    content: str = Form(...),
    thread_id: Optional[str] = Form(None),
    file_attachments: Optional[List[UploadFile]] = File(None),
):
    user = user_db_session[0]
    db_session = user_db_session[1]

    if not content or not content.strip():
        raise HTTPException(status_code=422, detail="content is required")

    # 1) Find (or create) a thread for this user
    res = await db_session.execute(select(Thread).where(Thread.user_id == user.id))
    thread = res.scalar_one_or_none()
    if not thread:
        created = await openai_client.create_thread()
        openai_tid = _extract_thread_id(created)
        thread = Thread(openai_thread_id=openai_tid, user_id=user.id)
        db_session.add(thread)
        await db_session.flush()

    # 2) Persist user's message
    user_msg = Message(
        thread_id=thread.openai_thread_id,
        type="user",
        content=content,
    )
    db_session.add(user_msg)
    await db_session.flush()  # ensure user_msg.id is available

    # 3) Upload & persist request file attachments (URLs returned by utils)
    uploaded_urls = await process_file_attachments(file_attachments or [])
    for url in uploaded_urls:
        db_session.add(FileAttachment(message_id=user_msg.id, file_url=url))

    # 4) First OpenAI call (raw model): produce unprocessed-info
    llm_raw = await openai_client.responses_create(
        model=Config.OPENAI_BASE_MODEL,
        input=content,
    )
    llm_text = _extract_text(llm_raw)

    resp_msg = Message(
        thread_id=thread.openai_thread_id,
        type="unprocessed-info",
        content=llm_text,
    )
    db_session.add(resp_msg)
    await db_session.flush()

    unprocessed_gutenberg = await openai_client.responses_create(
        model=Config.GUTENBERG_OPENAI_ENGINE_ID,
        input=[
        {"role": "system", "content": Config.GUTENBERG_SYSTEM_INSTRUCTIONS}, 
        {"role": "user", "content": llm_text}
        ],
    )
    unprocessed_gutenberg_text = _extract_text(unprocessed_gutenberg)

    unprocessed_gutenberg_msg = Message(
        thread_id=thread.openai_thread_id,
        type="unprocessed-gutenberg",
        content=unprocessed_gutenberg_text,
    )
    db_session.add(unprocessed_gutenberg_msg)
    await db_session.flush()

    processed_text, extra_attachments = await transform_gutenberg(unprocessed_gutenberg_text)

    processed_msg = Message(
        thread_id=thread.openai_thread_id,
        type="processed-gutenberg",
        content=processed_text,
    )
    db_session.add(processed_msg)
    await db_session.flush()

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

    return processed_msg


@messages_route.post("/test-stream")
async def test_stream():
    async def event_generator():
        response_gen = [
            "This is the first part of the response",
            "This is the second part of the response",
            "This is the third part of the response",
        ]
        for response in response_gen:
            # Server-Sent Events style
            yield f"data: {response}\n\n"
            await asyncio.sleep(2)
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
