import os
import json


class Config:
    OPENAI_BASE_MODEL = os.getenv('OPENAI_BASE_MODEL')
    AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')

    with open("./gutenberg.json", "r") as f:
        GUTENBERG_CONFIG = json.load(f)

    GUTENBERG_OPENAI_ENGINE_ID = GUTENBERG_CONFIG["openai_engine_id"]
    GUTENBERG_SYSTEM_INSTRUCTIONS = GUTENBERG_CONFIG["system_instructions"]

    TEMPORARY_BINARY_FILES_PATH = "./temporary_binary_files"