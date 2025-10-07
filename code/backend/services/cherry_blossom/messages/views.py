from fastapi import APIRouter, HTTPException
from starlette.responses import StreamingResponse
from myDependencies import AuthDep
from .streams import unprocessed_gutenberg_stream

messages_route = APIRouter(prefix="/messages", tags=["messages"])

# Browser handles get sgtreams much better than post streams
@messages_route.get("/unprocessed-gutenberg")
async def get_unprocessed_gutenberg(
    user_db_session: AuthDep,
    question: str = None,
):
    if not question: raise HTTPException(status_code=422, detail="question is required")
    user, db_session = user_db_session
    thread_id = None

    return StreamingResponse(unprocessed_gutenberg_stream(user=user, db_session=db_session, content=question, thread_id=thread_id), media_type="text/event-stream")
