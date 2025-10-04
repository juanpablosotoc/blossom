from typing import List, Tuple
from fastapi import UploadFile

from myOrm.models import FileAttachment  # only for type hints in process_gutenberg
from myAws import S3
from ..config import Config


async def process_file_attachments(files: List[UploadFile]) -> List[str]:
    """
    Upload incoming files to S3 and return a list of public URLs.
    DB persistence is handled by the caller (view).
    """
    urls: List[str] = []
    for file in files:
        # upload
        S3.upload_fileobj(
            bucket_name=Config.AWS_BUCKET_NAME,
            object_name=file.filename,
            file_obj=file.file,
        )
        # generate public URL
        url = S3.generate_public_url(bucket_name=Config.AWS_BUCKET_NAME, object_name=file.filename)
        urls.append(url)
    return urls