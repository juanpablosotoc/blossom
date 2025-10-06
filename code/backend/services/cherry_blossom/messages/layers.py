from ..config import Config
from ..openai_client import openai_client
from ..gutenberg import transform_gutenberg
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

async def processed_gutenberg_response(unprocessed_gutenberg_text: str, accumulator: Accumulator):
    # Local transform of Gutenberg → (processed_text, extra_attachments)
    yield sse_data("[PROCESS_GUTENBERG_START]")
    # Check if transform_gutenberg() raises an exception
    processed_text, extra_attachments = await transform_gutenberg(unprocessed_gutenberg_text)
    accumulator.accum.append(processed_text)
    accumulator.attachments.extend(extra_attachments)
    yield sse_data(processed_text)
    yield sse_data("[PROCESS_GUTENBERG_END]")
