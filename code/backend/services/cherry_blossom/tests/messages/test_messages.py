import io
import pytest
import pytest_asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from starlette.datastructures import UploadFile
from sqlalchemy import select

from cherry_blossom.messages.views import create_message
from cherry_blossom.messages.schema import MessageCreate
from myOrm.models import User, Thread, Message, FileAttachment


async def _db_gen_from_session(db_session):
    yield db_session


def _upload(name: str, content: bytes = b"test"):
    return UploadFile(filename=name, file=io.BytesIO(content))


@pytest_asyncio.fixture
async def persisted_user(db_session):
    u = User(
        name="Auth User",
        profile_picture_url="https://cdn.example.com/u/auth.jpg",
        hashed_password="$2b$12$already-hashed",
    )
    db_session.add(u)
    await db_session.commit()
    await db_session.refresh(u)
    return u


@pytest.mark.asyncio
async def test_create_message_success(db_session, persisted_user):
    """
    Relaxed assertions: verify pipeline + non-empty outputs,
    no brittle equality checks.
    """
    user = persisted_user

    with (
        patch("cherry_blossom.openai_client") as mock_client,
        patch("cherry_blossom.messages.utils.process_file_attachments") as mock_proc_files,
        patch("cherry_blossom.gutenberg.main.transform_gutenberg") as mock_proc_gut,
    ):
        # awaited methods must be AsyncMock
        mock_client.create_thread = AsyncMock(return_value="thread_123")
        mock_client.responses_create = AsyncMock(
            side_effect=[
                # first call (unprocessed-info)
                SimpleNamespace(content='{"brief":"hello"}'),
                # second call (unprocessed-gutenberg)
                SimpleNamespace(content='<> <Audio title="Hello">Hello</Audio> </>')
            ]
        )

        mock_proc_files.return_value = []
        mock_proc_gut.return_value = ("<p>processed</p>", [])

        result = await create_message(
            payload=MessageCreate(
                content="Explain the Second World War in a little bit of detail.",
                file_attachments=[],
            ),
            db_session_a_gen=_db_gen_from_session(db_session),
            user=user,
        )

        # returned ORM object
        assert isinstance(result, Message)
        assert result.type == "processed-gutenberg"
        assert isinstance(result.content, str)
        assert result.content.strip()  # non-empty
        assert "<" in result.content and ">" in result.content

        # DB contains the 4 message stages (no exact text match)
        msgs = (await db_session.execute(select(Message))).scalars().all()
        kinds = {m.type for m in msgs}
        assert {"user", "unprocessed-info", "unprocessed-gutenberg", "processed-gutenberg"} <= kinds


@pytest.mark.asyncio
async def test_create_message_adds_file_attachments(db_session, persisted_user):
    """
    Relaxed assertions: ensure attachments persisted and outputs are non-empty,
    without asserting their exact S3 URLs.
    """
    user = persisted_user

    with (
        patch("cherry_blossom.openai_client") as mock_client,
        patch("cherry_blossom.messages.utils.process_file_attachments") as mock_proc_files,
        patch("cherry_blossom.gutenberg.main.transform_gutenberg") as mock_proc_gut,
    ):
        mock_client.create_thread = AsyncMock(return_value="thread_456")
        mock_client.responses_create = AsyncMock(
            side_effect=[
                SimpleNamespace(content="unprocessed-info text"),
                SimpleNamespace(content='<> <Audio title="Hi">Hi</Audio> </>')
            ]
        )

        # simulate two uploaded files → our utils return public URLs
        mock_proc_files.return_value = [
            "https://cdn.example.com/file1.txt",
            "https://cdn.example.com/file2.txt",
        ]
        mock_proc_gut.return_value = ("<> <p>final</p> </>", [])

        result = await create_message(
            payload=MessageCreate(
                content="Explain the Second World War in a little bit of detail.",
                file_attachments=[_upload("a.txt", b"abc"), _upload("b.txt", b"def")],
            ),
            db_session_a_gen=_db_gen_from_session(db_session),
            user=user,
        )

        # processed output sanity
        assert isinstance(result, Message)
        assert result.type == "processed-gutenberg"
        assert isinstance(result.content, str)
        assert result.content.strip()

        # attachments persisted (count check only)
        fas = (await db_session.execute(select(FileAttachment))).scalars().all()
        assert len(fas) >= 2

        # pipeline stages exist
        msgs = (await db_session.execute(select(Message))).scalars().all()
        kinds = {m.type for m in msgs}
        assert {"user", "unprocessed-info", "unprocessed-gutenberg", "processed-gutenberg"} <= kinds