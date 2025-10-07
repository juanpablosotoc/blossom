from pydantic import BaseModel
from typing import List


class Transcript(BaseModel):
    word: str
    start: float
    end: float
    
class TTSResponse(BaseModel):
    audio_src: str
    transcript: List[Transcript]
    