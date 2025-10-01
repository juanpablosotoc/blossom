import asyncio
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Union, AsyncIterator

import aiofiles
from openai import AsyncOpenAI
from openai.pagination import AsyncCursorPage

from .config import Config
from myExceptions.ai import ChatGPTServiceError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMOpenAI:
    """
    Async helper around the OpenAI API covering:
    - Vector stores (Assistants file search)
    - Embeddings
    - Audio (TTS/STT)
    - Files
    - Images
    - Assistants Threads/Messages/Runs
    - Responses API (modern lightweight alternative)
    """

    def __init__(self) -> None:
        # SDK v1+ reads key from env by defecto; mantenemos compat con tu Config.
        self.client = AsyncOpenAI(api_key=getattr(Config, "OPENAI_API_KEY", None))

    # ---------------------------
    # Utilities
    # ---------------------------

    @staticmethod
    def _wrap_error(msg: str, err: Exception) -> ChatGPTServiceError:
        logger.error(f"{msg}: {err}")
        exc = ChatGPTServiceError(msg)
        exc.__cause__ = err
        return exc

    async def _with_retries(self, coro_factory, *, retries: int = 2, delay: float = 0.5):
        for attempt in range(retries + 1):
            try:
                return await coro_factory()
            except Exception as e:
                if attempt == retries:
                    raise
                await asyncio.sleep(delay * (2 ** attempt))

    # ----------------------------------------------------
    # Vector Stores (Assistants file search)
    # ----------------------------------------------------

    async def create_vector_db(self, name: str = "NewVectorDB") -> Any:
        try:
            return await self._with_retries(lambda: self.client.beta.vector_stores.create(name=name))
        except Exception as e:
            raise self._wrap_error("Error creating vector database", e)

    async def delete_vector_db(self, id: str) -> Any:
        try:
            return await self._with_retries(lambda: self.client.beta.vector_stores.delete(id=id))
        except Exception as e:
            raise self._wrap_error("Error deleting vector database", e)

    async def attach_file_to_vector_db(self, file_id: str, vector_db_id: str) -> Any:
        try:
            return await self._with_retries(
                lambda: self.client.beta.vector_stores.files.create(
                    vector_store_id=vector_db_id,
                    file_id=file_id,
                )
            )
        except Exception as e:
            raise self._wrap_error("Error attaching file to vector database", e)

    async def attach_files_to_vector_db(
        self, file_ids: Sequence[str], vector_db_id: str
    ) -> Any:
        try:
            return await self._with_retries(
                lambda: self.client.beta.vector_stores.file_batches.create(
                    vector_store_id=vector_db_id,
                    file_ids=list(file_ids),
                )
            )
        except Exception as e:
            raise self._wrap_error("Error attaching files to vector database", e)

    async def get_vector_store_files(self, vector_db_id: str) -> AsyncCursorPage[Any]:
        try:
            return await self._with_retries(
                lambda: self.client.beta.vector_stores.files.list(vector_store_id=vector_db_id)
            )
        except Exception as e:
            raise self._wrap_error("Error getting vector store files", e)

    # ----------------------------------------------------
    # Embeddings
    # ----------------------------------------------------

    async def embed_text(
        self, text: Union[str, List[str]], model: str = "text-embedding-3-large"
    ) -> Any:
        try:
            return await self._with_retries(
                lambda: self.client.embeddings.create(
                    model=model,
                    input=text,
                    encoding_format="float",
                )
            )
        except Exception as e:
            raise self._wrap_error("Error embedding text", e)

    # ----------------------------------------------------
    # Audio: Text → Speech (TTS)
    # ----------------------------------------------------

    async def text_to_speech(
        self,
        text: str,
        *,
        model: str = "gpt-4o-mini-tts",
        voice: str = "alloy",
        speech_file_path: Union[str, Path] = "speech.mp3",
        format: str = "mp3",
    ) -> Path:
        out_path = Path(speech_file_path)
        try:
            async with self.client.audio.speech.with_streaming_response.create(
                model=model,
                voice=voice,
                input=text,
                format=format,
            ) as response:
                await response.stream_to_file(out_path)
            logger.info(f"TTS saved to {out_path}")
            return out_path
        except Exception as e:
            raise self._wrap_error("Error converting text to speech", e)

    # ----------------------------------------------------
    # Audio: Speech → Text (Transcription)
    # ----------------------------------------------------

    async def get_transcription(
        self,
        audio_file_path: Union[str, Path],
        *,
        model: str = "gpt-4o-transcribe",  # o "gpt-4o-mini-transcribe"
        prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        granularity: Optional[str] = None,  # "word" | "segment"
    ) -> Any:
        path = Path(audio_file_path)
        try:
            async with aiofiles.open(path, "rb") as f:
                transcript = await self._with_retries(
                    lambda: self.client.audio.transcriptions.create(
                        file=f,  # el SDK acepta file-like async; si tu runtime no, usa bytes = await f.read()
                        model=model,
                        response_format="verbose_json",
                        prompt=prompt,
                        temperature=temperature,
                        timestamp_granularities=[granularity] if granularity else None,
                    )
                )
            return transcript
        except Exception as e:
            raise self._wrap_error("Error transcribing audio", e)

    # ----------------------------------------------------
    # Files
    # ----------------------------------------------------

    async def upload_file(self, file_path: Union[str, Path], *, purpose: str) -> Any:
        """
        purpose:
          - 'assistants' para File Search / herramientas
          - 'fine-tune' para RFT/FT
        """
        path = Path(file_path)
        try:
            async with aiofiles.open(path, "rb") as f:
                return await self._with_retries(
                    lambda: self.client.files.create(file=f, purpose=purpose)
                )
        except Exception as e:
            raise self._wrap_error("Error uploading file", e)

    async def delete_file(self, id: str) -> Any:
        try:
            return await self._with_retries(lambda: self.client.files.delete(id))
        except Exception as e:
            raise self._wrap_error("Error deleting file", e)

    # ----------------------------------------------------
    # Images
    # ----------------------------------------------------

    async def create_image(
        self,
        prompt: str,
        *,
        model: str = "gpt-image-1",
        n: int = 1,
        size: str = "1024x1024",
        **kwargs: Any,
    ) -> Any:
        try:
            return await self._with_retries(
                lambda: self.client.images.generate(
                    model=model,
                    prompt=prompt,
                    n=n,
                    size=size,
                    **kwargs,
                )
            )
        except Exception as e:
            raise self._wrap_error("Error generating image", e)

    # ----------------------------------------------------
    # Assistants: Threads / Messages
    # ----------------------------------------------------

    async def create_thread(self, messages: Optional[List[Dict[str, Any]]] = None) -> Any:
        messages = messages or []
        try:
            return await self._with_retries(lambda: self.client.beta.threads.create(messages=messages))
        except Exception as e:
            raise self._wrap_error("Error creating thread", e)

    async def delete_thread(self, id: str) -> Any:
        try:
            return await self._with_retries(lambda: self.client.beta.threads.delete(id))
        except Exception as e:
            raise self._wrap_error("Error deleting thread", e)

    async def create_message(self, *, thread_id: str, role: str, content: str) -> Any:
        try:
            return await self._with_retries(
                lambda: self.client.beta.threads.messages.create(
                    thread_id=thread_id,
                    role=role,
                    content=content,
                )
            )
        except Exception as e:
            raise self._wrap_error("Error creating message", e)

    async def list_messages(self, thread_id: str) -> AsyncCursorPage[Any]:
        try:
            return await self._with_retries(
                lambda: self.client.beta.threads.messages.list(thread_id=thread_id)
            )
        except Exception as e:
            raise self._wrap_error("Error listing messages", e)

    # ----------------------------------------------------
    # Assistants: Runs  (sigue disponible; para flujos nuevos prefiere Responses API)
    # ----------------------------------------------------

    async def create_run(
        self,
        *,
        thread_id: str,
        assistant_id: str,
        model: Optional[str] = None,
        instructions: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_resources: Optional[Dict[str, Any]] = None,
        stream: bool = False,
        response_format: Union[str, Dict[str, Any]] = "auto",
        additional_messages: Optional[List[Dict[str, Any]]] = None,
    ) -> Any:
        try:
            return await self._with_retries(
                lambda: self.client.beta.threads.runs.create(
                    thread_id=thread_id,
                    assistant_id=assistant_id,
                    model=model,
                    instructions=instructions,
                    tools=tools or [],
                    tool_resources=tool_resources,
                    response_format=response_format,
                    stream=stream,
                    additional_messages=additional_messages or [],
                )
            )
        except Exception as e:
            raise self._wrap_error("Error creating run", e)

    # ----------------------------------------------------
    # Responses API
    # ----------------------------------------------------

    async def responses_create(
        self,
        *,
        model: str,
        input: Union[str, List[Union[str, Dict[str, Any]]]],
        temperature: Optional[float] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        response_format: Optional[Union[str, Dict[str, Any]]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Any:
        try:
            return await self._with_retries(
                lambda: self.client.responses.create(
                    model=model,
                    input=input,
                    temperature=temperature,
                    tools=tools,
                    response_format=response_format,
                    metadata=metadata,
                )
            )
        except Exception as e:
            raise self._wrap_error("Error creating response", e)

    async def responses_stream(
        self,
        *,
        model: str,
        input: Union[str, List[Union[str, Dict[str, Any]]]],
        temperature: Optional[float] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        response_format: Optional[Union[str, Dict[str, Any]]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[str]:
        """
        Streaming robusto para Responses API (maneja el tipo de evento oficial).
        """
        try:
            async with self.client.responses.stream(
                model=model,
                input=input,
                temperature=temperature,
                tools=tools,
                response_format=response_format,
                metadata=metadata,
            ) as stream:
                async for event in stream:
                    # Forma canónica: texto incremental viene como "response.output_text.delta"
                    etype = getattr(event, "type", None)
                    if etype == "response.output_text.delta":
                        delta = getattr(event, "delta", None)
                        if isinstance(delta, str):
                            yield delta
                    # Fallback: algunos SDKs exponen 'delta' plano
                    elif hasattr(event, "delta") and isinstance(event.delta, str):
                        yield event.delta
                # Opcional: obtener el objeto final si lo necesitas
                # final_resp = await stream.get_final_response()
        except Exception as e:
            raise self._wrap_error("Error streaming response", e)