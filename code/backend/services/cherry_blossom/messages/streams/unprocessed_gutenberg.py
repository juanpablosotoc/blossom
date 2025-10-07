from fastapi import HTTPException
from sqlalchemy import select
from myOrm.models import Thread, Message
from .utils import _extract_thread_id, sse_data
from cherry_blossom.openai_client import openai_client
from .layers import Accumulator, openai_raw_response, unprocessed_gutenberg_response


async def unprocessed_gutenberg_stream(
    user,
    db_session,
    content,
    thread_id,
):
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

    unprocessed_gutenberg_accum = Accumulator()
    async for sse_data_text in unprocessed_gutenberg_response(llm_text, unprocessed_gutenberg_accum): yield sse_data_text
    unprocessed_gutenberg_text = "".join(unprocessed_gutenberg_accum.accum).strip()

    unprocessed_gutenberg_msg = Message(
        thread_id=thread.openai_thread_id,
        type="unprocessed-gutenberg",
        content=unprocessed_gutenberg_text,
    )
    db_session.add(unprocessed_gutenberg_msg)

    await db_session.commit()

    # SSE terminator
    yield sse_data("[DONE]")
