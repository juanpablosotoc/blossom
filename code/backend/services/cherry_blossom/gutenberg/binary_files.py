import os
from uuid import uuid4
from pydub import AudioSegment
from uuid import uuid4
from ..config import Config


def join_mp3_files(mp3_files):
    """
    Combines multiple MP3 files into a single MP3 file.

    Args:
        mp3_files (list): A list of file paths to the MP3 files.

    Returns:
        str: The file path of the combined MP3 file.

    Raises:
        FileNotFoundError: If any of the input MP3 files are not found.
    """
    # Start with the first file
    combined = AudioSegment.from_mp3(mp3_files[0])

    # Loop through and append the rest of the files
    for mp3_file in mp3_files[1:]:
        next_segment = AudioSegment.from_mp3(mp3_file)
        combined += next_segment

    # generate uid for filename
    filename = str(uuid4())
    basename = f'{filename}.mp3'
    filepath = os.path.join(Config.TEMPORARY_BINARY_FILES_PATH, basename)
    # Export the combined audio
    combined.export(filepath, format="mp3")
    return filepath
