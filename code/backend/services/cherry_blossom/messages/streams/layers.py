from cherry_blossom.config import Config
from cherry_blossom.openai_client import openai_client
from .utils import sse_data


class Accumulator:
    def __init__(self):
        self.accum = []
        self.attachments = []

async def openai_raw_response(content: str, accumulator: Accumulator):
    # First OpenAI call (raw model): STREAM → aggregate → save as unprocessed-info
    yield sse_data("[OPENAI_RAW_RESPONSE_START]")
    async for delta in openai_client.responses_stream(
        model=Config.OPENAI_BASE_MODEL,
        input=content,
    ):
        accumulator.accum.append(delta)
        # stream deltas as they arrive; safe for newlines
        yield sse_data(delta)

    yield sse_data("[OPENAI_RAW_RESPONSE_END]")

async def unprocessed_gutenberg_response(content: str, accumulator: Accumulator):
    yield sse_data("[UNPROCESSED_GUTENBERG_START]")
    async for delta in openai_client.responses_stream(
        model=Config.GUTENBERG_OPENAI_ENGINE_ID,
        input=[
            {"role": "system", "content": Config.GUTENBERG_SYSTEM_INSTRUCTIONS},
            {"role": "user", "content": content},
        ],
    ):
        accumulator.accum.append(delta)
        yield sse_data(delta)
    yield sse_data("[UNPROCESSED_GUTENBERG_END]")
