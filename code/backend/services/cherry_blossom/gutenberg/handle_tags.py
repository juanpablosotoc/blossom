import os
from ..config import Config
from uuid import uuid4
from lxml import etree as ET
from pydub import AudioSegment
from .binary_files import join_mp3_files
import json
from ..openai_client import openai_client
from myAws import S3


async def handleVideoTag(video_tag):
    """
    Process a video tag by extracting audio, uploading it to an S3 server,
    generating a public URL, and updating the XML tree with the audio source
    and transcript.

    Args:
        video_tag (str): The video tag in XML format.

    Returns:
        str: The modified XML tree as a string.

    Raises:
        VideoTransformError: If there is an error in processing the video tag.
    """
    root = ET.fromstring(video_tag)

    audioSrcs = []
    prevEnd = 0
    for frame in root.findall('.//Frame'):
        video_audio = frame.find('VideoAudio')
        if video_audio is not None:
            basename = f'{str(uuid4())}.mp3'
            audio_src = os.path.join(Config.TEMPORARY_BINARY_FILES_PATH, basename)

            # Generate audio file path using TTS
            await openai_client.text_to_speech(text=video_audio.text.strip(), voice='alloy', speech_file_path=audio_src)
            audioSrcs.append(audio_src)
            
            # Remove the VideoAudio element
            frame.remove(video_audio)

            # set the previous end time to the current end time
            audioSegment = AudioSegment.from_mp3(audio_src)
            length = len(audioSegment) / 1000 # in seconds
            frame.set('start', str(prevEnd))
            frame.set('end', str(prevEnd + length))

            prevEnd += length

    # join all audios into one
    audio_file_path = join_mp3_files(audioSrcs)

    # delete the audio files
    for audio_src in audioSrcs: os.remove(audio_src)

    # get the transcript 
    openai_transcript = await openai_client.get_transcription(audio_file_path=audio_file_path, granularity='word')

    basename = os.path.basename(audio_file_path)

    # upload to s3
    S3.upload_file(
        bucket_name=Config.AWS_BUCKET_NAME,
        object_name=basename,
        file_path=audio_file_path,
    )
        
    # remove the audio file
    os.remove(audio_file_path)

    # set the audio file path in the root element
    root.set('audioSrc', S3.generate_public_url(bucket_name=Config.AWS_BUCKET_NAME, object_name=basename))

    serialized_words = [{"end": word.end, "start": word.start, "word": word.word} for word in openai_transcript.words]
    
    # Add the transcript to the root element
    root.set('transcript', json.dumps(serialized_words))

    # Convert the modified XML tree back to a string
    transformed_xml_string = ET.tostring(root, encoding='unicode', method='xml')
    return transformed_xml_string, [basename]


async def handleAudioTag(audio_tag):
    """
    Process an audio tag by generating audio from text, uploading it to an S3 server,
    and updating the XML tree with the audio source and transcript.

    Args:
        audio_tag (str): The audio tag in XML format.

    Returns:
        str: The modified XML tree as a string.

    Raises:
        AudioTransformError: If there is an error in processing the audio tag.
    """
    root = ET.fromstring(audio_tag)
    # Generate unique filename for the audio file
    basename = f'{str(uuid4())}.mp3'
    audio_src = os.path.join(Config.TEMPORARY_BINARY_FILES_PATH, basename)

    # Generate audio file path using TTS
    await openai_client.text_to_speech(text=root.text.strip(), voice='alloy', speech_file_path=audio_src)

    # get the transcript 
    openai_transcript = await openai_client.get_transcription(audio_file_path=audio_src, granularity='word')

    basename = os.path.basename(audio_src)

    send_data = {
            'bucket': Config.AWS_BUCKET_NAME,
            'key': basename,
            'local_key': basename
    }

    S3.upload_file(
        bucket_name=Config.AWS_BUCKET_NAME,
        object_name=basename,
        file_path=audio_src,
    )

    # remove the audio file
    os.remove(audio_src)
    
    # set the audio file path in the root element
    root.set('src', S3.generate_public_url(bucket_name=Config.AWS_BUCKET_NAME, object_name=basename))

    serialized_words = [{"end": word.end, "start": word.start, "word": word.word} for word in openai_transcript.words]
    
    # Add the transcript to the root element
    root.set('transcript', json.dumps(serialized_words))

    # Remove inner text
    root.text = None

    # Convert the modified XML tree back to a string
    transformed_xml_string = ET.tostring(root, encoding='unicode', method='xml')
    return transformed_xml_string, [basename]
    