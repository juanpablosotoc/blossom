from pydantic import BaseModel
from typing import Optional


class CreateMessageRequest(BaseModel):
    content: str
    thread_id: Optional[str] = None