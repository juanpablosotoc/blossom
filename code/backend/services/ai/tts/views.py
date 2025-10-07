from fastapi import APIRouter
import os
import uuid
from myDependencies import AuthDep
from .schema import TTSResponse, Transcript
from ai.openai_client import openai_client
from ai.config import Config
from myAws import S3

tts_route = APIRouter(prefix="/ai/tts", tags=["tts"])
        

# Browser handles get sgtreams much better than post streams
@tts_route.get("/")
async def tts(
    user_db_session: AuthDep,
    text: str,
):
    user, db_session = user_db_session
    audio_name = f"{uuid.uuid4()}.mp3"
    audio_src = os.path.join(Config.TEMPORARY_BINARY_FILES_PATH, audio_name)    
    
    await openai_client.text_to_speech(text=text, speech_file_path=audio_src)
    openai_transcript = await openai_client.get_transcription(audio_file_path=audio_src)

    # Print all of the attrs of openai_transcript
    print(openai_transcript.__dict__)

    #########################################################
    # Save audio to S3
    #########################################################
    S3.upload_file(bucket_name=Config.AWS_BUCKET_NAME, object_name=audio_name, file_path=audio_src)
    #########################################################
    # Eliminate temp files  
    #########################################################
    os.remove(audio_src)
    #########################################################
    audio_url = S3.generate_public_url(bucket_name=Config.AWS_BUCKET_NAME, object_name=audio_name)

    #########################################################
    # Just so doesnt bug next api call, TODO change to actually save transcript later
    db_session.commit()

    return TTSResponse(audio_src=audio_url, transcript=[Transcript(word=word.word, start=word.start, end=word.end) for word in openai_transcript.words])
