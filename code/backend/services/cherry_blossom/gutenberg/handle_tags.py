import os
from ..config import Config
from uuid import uuid4
from lxml import etree as ET
from pydub import AudioSegment
from .binary_files import join_mp3_files
import json
from ..openai_client import openai_client
from myAws import S3
import asyncio


_SEM = asyncio.Semaphore(4)

async def _tts_one_frame(idx: int, text: str) -> tuple[int, str, float]:
    """
    TTS for a single frame, return (index, temp_mp3_path, duration_seconds).
    """
    # unique temp file per frame
    basename = f"{uuid4()}.mp3"
    audio_src = os.path.join(Config.TEMPORARY_BINARY_FILES_PATH, basename)

    async with _SEM:
        await openai_client.text_to_speech(
            text=text.strip(),
            voice="alloy",
            speech_file_path=audio_src,
        )

    # measure duration
    seg = AudioSegment.from_mp3(audio_src)
    duration_s = len(seg) / 1000.0
    return idx, audio_src, duration_s

async def handleVideoTag(video_tag: str):
    """
    Process a <Video> tag by:
      - Running TTS for each <Frame><VideoAudio> concurrently
      - Computing timeline start/end from TTS durations (in original order)
      - Joining per-frame MP3s into a single audio file
      - Uploading to S3 and setting audioSrc + transcript on <Video>
    Returns:
      transformed_xml_string, [uploaded_basename]
    """
    root = ET.fromstring(video_tag)

    # 1) Collect frames + their <VideoAudio> text (preserve order)
    frames = list(root.findall(".//Frame"))
    items: list[tuple[int, ET._Element, ET._Element, str]] = []  # (idx, frame_el, va_el, text)
    for i, frame in enumerate(frames):
        va = frame.find("VideoAudio")
        if va is not None and (va.text or "").strip():
            items.append((i, frame, va, va.text.strip()))

    # If no audio to process, simply return the tag unchanged
    if not items:
        return ET.tostring(root, encoding="unicode", method="xml"), []

    # 2) Launch all TTS tasks in parallel
    tts_tasks = [
        _tts_one_frame(idx, text)
        for (idx, _frame, _va, text) in items
    ]
    tts_results = await asyncio.gather(*tts_tasks)

    # 3) Sort results by original frame index and compute timeline
    tts_results.sort(key=lambda x: x[0])  # ensure original order
    audio_paths: list[str] = []
    durations: list[float] = []
    for _idx, path, dur in tts_results:
        audio_paths.append(path)
        durations.append(dur)

    # 4) Remove <VideoAudio>, set start/end on each corresponding <Frame>
    prev_end = 0.0
    for (i, frame, va, _text), dur in zip(items, durations):
        # strip the <VideoAudio>
        try:
            frame.remove(va)
        except Exception:
            pass
        frame.set("start", str(prev_end))
        end = prev_end + float(dur)
        frame.set("end", str(end))
        prev_end = end

    # 5) Join mp3s (in order), upload, transcript, cleanup temps
    merged_path = join_mp3_files(audio_paths)

    # Clean up per-frame temp files
    for p in audio_paths:
        try:
            os.remove(p)
        except Exception as e:
            print(f"Error removing temp file {p}: {e}")

    # Transcribe the merged file (word-level if your get_transcription supports it)
    transcript_obj = await openai_client.get_transcription(
        audio_file_path=merged_path,
        granularity="word",  # your client maps this to the right API call
    )

    # Upload merged file to S3
    merged_basename = os.path.basename(merged_path)
    S3.upload_file(
        bucket_name=Config.AWS_BUCKET_NAME,
        object_name=merged_basename,
        file_path=merged_path,
    )
    # local cleanup
    try:
        os.remove(merged_path)
    except Exception as e:
        print(f"Error removing temp file {merged_path}: {e}")

    # Set attributes on <Video>
    public_url = S3.generate_public_url(
        bucket_name=Config.AWS_BUCKET_NAME, object_name=merged_basename
    )
    root.set("audioSrc", public_url)

    # Expecting transcript_obj.words like: [{word, start, end}, ...]
    # Adjust this if your client returns a different shape.
    words = getattr(transcript_obj, "words", None)
    if words is None and isinstance(transcript_obj, dict):
        words = transcript_obj.get("words")
    if words is None:
        words = []

    serialized_words = [
        {"word": w.get("word") if isinstance(w, dict) else getattr(w, "word", None),
         "start": w.get("start") if isinstance(w, dict) else getattr(w, "start", None),
         "end": w.get("end") if isinstance(w, dict) else getattr(w, "end", None)}
        for w in words
    ]
    root.set("transcript", json.dumps(serialized_words))

    # 6) Return updated XML + uploaded file id
    transformed_xml_string = ET.tostring(root, encoding="unicode", method="xml")
    return transformed_xml_string, [merged_basename]


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
    