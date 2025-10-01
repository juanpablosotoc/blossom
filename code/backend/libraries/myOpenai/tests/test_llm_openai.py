# test_llm_openai.py
# Requires: pytest, pytest-asyncio
# Run: pytest -q
import asyncio
from types import SimpleNamespace
from pathlib import Path
from typing import Any, Dict, List
import pytest
from myOpenai import LLMOpenAI

pytestmark = pytest.mark.asyncio


# ---------------------------
# Helpers: async mocks / fakes
# ---------------------------
class AsyncCallable:
    """Awaitable callable returning a preset value or raising."""
    def __init__(self, result: Any = None, exc: Exception = None):
        self._result = result
        self._exc = exc
        self.calls: List[Dict[str, Any]] = []

    async def __call__(self, *args, **kwargs):
        self.calls.append({"args": args, "kwargs": kwargs})
        if self._exc:
            raise self._exc
        return self._result


class AsyncCM:
    """Generic async context manager that yields a value."""
    def __init__(self, value):
        self.value = value

    async def __aenter__(self):
        return self.value

    async def __aexit__(self, exc_type, exc, tb):
        return False


class StreamingTTSObject:
    """Object returned by TTS context manager; has async stream_to_file."""
    def __init__(self, payload: bytes = b"FAKE_AUDIO"):
        self.payload = payload
        self.stream_calls: List[Path] = []

    async def stream_to_file(self, path: Path):
        self.stream_calls.append(path)
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(self.payload)


class FakeResponsesStream:
    """
    Async context manager that yields events with `.delta` text chunks.
    Simulates the `client.responses.stream(...)` surface.
    """
    def __init__(self, chunks):
        self._chunks = chunks

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return False

    def __aiter__(self):
        async def gen():
            for ch in self._chunks:
                yield SimpleNamespace(delta=ch)
        return gen()


# ---------------------------
# Fixture: mock AsyncOpenAI wiring
# ---------------------------
@pytest.fixture
def mock_openai_client(monkeypatch, tmp_path):
    """
    Build a fake AsyncOpenAI client with the nested attributes/methods used by LLMOpenAI.
    Patch LLMOpenAI to receive this client from AsyncOpenAI(api_key=...).
    """
    # ---- Vector stores
    beta_vector_stores_create = AsyncCallable(result={"id": "vs_123", "name": "NewVectorDB"})
    beta_vector_stores_delete = AsyncCallable(result={"id": "vs_123", "deleted": True})
    beta_vector_files_create = AsyncCallable(result={"id": "file_vs_1"})
    beta_vector_file_batches_create = AsyncCallable(result={"id": "batch_1", "status": "in_progress"})
    beta_vector_files_list = AsyncCallable(result={"data": [{"id": "file_vs_1"}]})

    vector_stores_files = SimpleNamespace(
        create=beta_vector_files_create,
        list=beta_vector_files_list
    )
    vector_stores_file_batches = SimpleNamespace(
        create=beta_vector_file_batches_create
    )
    vector_stores = SimpleNamespace(
        create=beta_vector_stores_create,
        delete=beta_vector_stores_delete,
        files=vector_stores_files,
        file_batches=vector_stores_file_batches,
    )

    # ---- Threads / Messages / Runs (Assistants)
    threads_create = AsyncCallable(result={"id": "th_1"})
    threads_delete = AsyncCallable(result={"id": "th_1", "deleted": True})
    threads_messages_create = AsyncCallable(result={"id": "msg_1", "role": "user"})
    threads_messages_list = AsyncCallable(result={"data": [{"id": "msg_1"}, {"id": "msg_2"}]})
    threads_runs_create = AsyncCallable(result={"id": "run_1", "status": "queued"})

    threads_messages = SimpleNamespace(
        create=threads_messages_create,
        list=threads_messages_list
    )
    threads_runs = SimpleNamespace(
        create=threads_runs_create
    )
    threads = SimpleNamespace(
        create=threads_create,
        delete=threads_delete,
        messages=threads_messages,
        runs=threads_runs,
    )

    beta = SimpleNamespace(
        vector_stores=vector_stores,
        threads=threads
    )

    # ---- Embeddings
    embeddings_create = AsyncCallable(result={"data": [{"embedding": [0.1, 0.2]}]})
    embeddings = SimpleNamespace(create=embeddings_create)

    # ---- Audio: TTS + STT
    tts_obj = StreamingTTSObject()
    audio_speech_with_streaming = SimpleNamespace(
        create=lambda **_: AsyncCM(tts_obj)
    )
    audio_speech = SimpleNamespace(with_streaming_response=audio_speech_with_streaming)

    transcriptions_create = AsyncCallable(result={"text": "hello world", "segments": []})
    audio_transcriptions = SimpleNamespace(create=transcriptions_create)

    audio = SimpleNamespace(
        speech=audio_speech,
        transcriptions=audio_transcriptions
    )

    # ---- Files
    files_create = AsyncCallable(result={"id": "file_1", "filename": "x.txt"})
    files_delete = AsyncCallable(result={"id": "file_1", "deleted": True})
    files = SimpleNamespace(create=files_create, delete=files_delete)

    # ---- Images
    images_generate = AsyncCallable(result={"data": [{"b64_json": "AAA"}]})
    images = SimpleNamespace(generate=images_generate)

    # ---- Responses API
    def responses_create_fn(**kwargs):
        return {"output_text": "final text", "model": kwargs.get("model")}
    responses_create = AsyncCallable(result=None)
    # We need to inspect kwargs, so wrap:
    async def responses_create_wrapper(**kwargs):
        responses_create.calls.append({"args": (), "kwargs": kwargs})
        return responses_create_fn(**kwargs)

    def responses_stream_fn(**kwargs):
        return FakeResponsesStream(["Hel", "lo ", "Juan"])
    responses_stream = responses_stream_fn

    responses = SimpleNamespace(
        create=responses_create_wrapper,
        stream=responses_stream
    )

    # ---- Compose fake client
    fake_client = SimpleNamespace(
        beta=beta,
        embeddings=embeddings,
        audio=audio,
        files=files,
        images=images,
        responses=responses,
    )

    # Patch AsyncOpenAI constructor in the target module to return fake_client
    # (LLMOpenAI imports AsyncOpenAI inside its module; patch that symbol there)
    import importlib
    target_module = importlib.import_module("myOpenai")  # 🔧 update if you changed import above
    monkeypatch.setattr(target_module, "AsyncOpenAI", lambda api_key=None: fake_client, raising=True)

    return SimpleNamespace(
        client=fake_client,
        tmp_path=tmp_path,
        tts_obj=tts_obj,
        calls={
            "beta_vector_stores_create": beta_vector_stores_create,
            "beta_vector_stores_delete": beta_vector_stores_delete,
            "beta_vector_files_create": beta_vector_files_create,
            "beta_vector_file_batches_create": beta_vector_file_batches_create,
            "beta_vector_files_list": beta_vector_files_list,
            "threads_create": threads_create,
            "threads_delete": threads_delete,
            "threads_messages_create": threads_messages_create,
            "threads_messages_list": threads_messages_list,
            "threads_runs_create": threads_runs_create,
            "embeddings_create": embeddings_create,
            "transcriptions_create": transcriptions_create,
            "files_create": files_create,
            "files_delete": files_delete,
            "images_generate": images_generate,
            "responses_create": responses_create,  # wrapper records in this
        },
    )


# ---------------------------
# Tests
# ---------------------------

async def test_create_vector_db(mock_openai_client):
    api = LLMOpenAI()
    out = await api.create_vector_db("MyDB")
    assert out["name"] == "NewVectorDB"
    calls = mock_openai_client.calls["beta_vector_stores_create"].calls
    assert calls and calls[-1]["kwargs"]["name"] == "MyDB"


async def test_delete_vector_db(mock_openai_client):
    api = LLMOpenAI()
    out = await api.delete_vector_db("vs_123")
    assert out["deleted"] is True
    calls = mock_openai_client.calls["beta_vector_stores_delete"].calls
    assert calls and calls[-1]["kwargs"]["id"] == "vs_123"


async def test_attach_file_to_vector_db(mock_openai_client):
    api = LLMOpenAI()
    out = await api.attach_file_to_vector_db("file_1", "vs_123")
    assert out["id"] == "file_vs_1"
    calls = mock_openai_client.calls["beta_vector_files_create"].calls
    assert calls and calls[-1]["kwargs"] == {"vector_store_id": "vs_123", "file_id": "file_1"}


async def test_attach_files_to_vector_db_batch(mock_openai_client):
    api = LLMOpenAI()
    out = await api.attach_files_to_vector_db(["f1", "f2"], "vs_123")
    assert out["status"] == "in_progress"
    calls = mock_openai_client.calls["beta_vector_file_batches_create"].calls
    assert calls and calls[-1]["kwargs"]["file_ids"] == ["f1", "f2"]


async def test_get_vector_store_files(mock_openai_client):
    api = LLMOpenAI()
    out = await api.get_vector_store_files("vs_123")
    assert out["data"][0]["id"] == "file_vs_1"


async def test_embed_text_single_and_list(mock_openai_client):
    api = LLMOpenAI()
    r1 = await api.embed_text("hello")
    r2 = await api.embed_text(["a", "b"])
    assert "data" in r1 and "data" in r2
    calls = mock_openai_client.calls["embeddings_create"].calls
    # last call had list
    assert isinstance(calls[-1]["kwargs"]["input"], list)


async def test_text_to_speech_streams_to_file(mock_openai_client, tmp_path):
    api = LLMOpenAI()
    out_file = tmp_path / "out" / "speech.mp3"
    path = await api.text_to_speech("hola", speech_file_path=out_file)
    assert path.exists()
    assert path.read_bytes() == b"FAKE_AUDIO"
    assert mock_openai_client.tts_obj.stream_calls and mock_openai_client.tts_obj.stream_calls[-1] == out_file


async def test_get_transcription(mock_openai_client, tmp_path, monkeypatch):
    # Create a fake audio file; we won't actually read via aiofiles in this test, but the SDK surface allows file-like.
    # The class uses aiofiles.open(..., "rb"); keep it simple by patching aiofiles.open to return an async CM yielding bytes-like.
    import myOpenai  # 🔧 update module path if needed

    class FakeAIOFile:
        async def read(self, *_, **__):
            return b"FAKEWAV"
        async def __aenter__(self):  # aiofiles.open returns a file-like with async cm
            return self
        async def __aexit__(self, exc_type, exc, tb):
            return False

    monkeypatch.setattr(myOpenai, "aiofiles", SimpleNamespace(open=lambda *_args, **_kw: FakeAIOFile()))  # patch module-level aiofiles

    api = LLMOpenAI()
    out = await api.get_transcription(tmp_path / "fake.wav", granularity="word")
    assert out["text"] == "hello world"
    calls = mock_openai_client.calls["transcriptions_create"].calls
    # last call should include response_format and maybe timestamp granularity
    assert calls and calls[-1]["kwargs"]["response_format"] == "verbose_json"


async def test_upload_and_delete_file(mock_openai_client, tmp_path, monkeypatch):
    # Patch aiofiles.open similar to above to simulate a file handle
    import myOpenai  # 🔧 update module path if needed

    class FakeAIOFile:
        async def read(self, *_, **__):
            return b"DATA"
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc, tb):
            return False

    monkeypatch.setattr(myOpenai, "aiofiles", SimpleNamespace(open=lambda *_args, **_kw: FakeAIOFile()))

    api = LLMOpenAI()
    up = await api.upload_file(tmp_path / "x.txt", purpose="assistants")
    assert up["id"] == "file_1"
    de = await api.delete_file("file_1")
    assert de["deleted"] is True

    calls_up = mock_openai_client.calls["files_create"].calls
    assert calls_up and calls_up[-1]["kwargs"]["purpose"] == "assistants"
    calls_del = mock_openai_client.calls["files_delete"].calls
    assert calls_del and calls_del[-1]["args"][0] == "file_1"


async def test_create_image(mock_openai_client):
    api = LLMOpenAI()
    img = await api.create_image("a cat wearing sunglasses", model="gpt-image-1", n=2, size="512x512")
    assert "data" in img
    calls = mock_openai_client.calls["images_generate"].calls
    assert calls and calls[-1]["kwargs"]["n"] == 2 and calls[-1]["kwargs"]["size"] == "512x512"


async def test_threads_messages_runs(mock_openai_client):
    api = LLMOpenAI()
    th = await api.create_thread([{"role": "user", "content": "hi"}])
    assert th["id"] == "th_1"
    msg = await api.create_message(thread_id="th_1", role="user", content="hey")
    assert msg["id"] == "msg_1"
    msgs = await api.list_messages("th_1")
    assert len(msgs["data"]) == 2
    run = await api.create_run(thread_id="th_1", assistant_id="asst_1", model="gpt-4.1-mini")
    assert run["id"] == "run_1"
    deleted = await api.delete_thread("th_1")
    assert deleted["deleted"] is True


async def test_responses_create_and_stream(mock_openai_client):
    api = LLMOpenAI()
    res = await api.responses_create(model="gpt-4.1-mini", input="Hello")
    assert res["output_text"] == "final text"

    chunks = []
    async for part in api.responses_stream(model="gpt-4.1-mini", input="Stream this"):
        chunks.append(part)
    assert "".join(chunks) == "Hello Juan"


# ---------------------------
# Error path: ensure ChatGPTServiceError is raised
# ---------------------------
async def test_error_wrapping_on_embed(monkeypatch):
    import myOpenai

    # Build a minimal fake client where embeddings.create raises
    class RaisingAsyncCallable:
        def __init__(self, exc: Exception):
            self.exc = exc
        async def __call__(self, *a, **kw):
            raise self.exc

    fake_client = SimpleNamespace(
        embeddings=SimpleNamespace(create=RaisingAsyncCallable(RuntimeError("boom")))
    )

    # Patch AsyncOpenAI in myOpenai to return the failing client
    monkeypatch.setattr(myOpenai, "AsyncOpenAI", lambda api_key=None: fake_client, raising=True)

    api = LLMOpenAI()
    with pytest.raises(Exception) as ei:
        await api.embed_text("x")
    # The class wraps errors into ChatGPTServiceError; message should mention embedding
    assert "Error embedding text" in str(ei.value)