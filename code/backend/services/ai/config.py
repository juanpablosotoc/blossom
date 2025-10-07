import os
import json


class Config:
    OPENAI_BASE_MODEL = os.getenv('OPENAI_BASE_MODEL')
    AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')
    TEMPORARY_BINARY_FILES_PATH = "./temporary_binary_files"
    