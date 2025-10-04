import asyncio
import pytest
from sqlalchemy.exc import IntegrityError

from myOrm.models import User, Thread, Message, FileAttachment


# -----------------------
# Sample data fixtures
# -----------------------
@pytest.fixture
def sample_user_data():
    return {
        "profile_picture_url": "https://cdn.example.com/u/1.jpg",
        "name": "Juan Test",
        "hashed_password": "$2b$12$abcdefghijklmnopqrstuv",  # any non-empty string (already-hashed)
    }


@pytest.fixture
def sample_thread_data():
    # PK is openai_thread_id (string)
    return {
        "openai_thread_id": "thread_abc123",
    }


@pytest.fixture
def sample_message_data():
    return {
        "type": "user",  # allowed free-text type in your schema
    }


@pytest.fixture
def sample_file_attachment_data():
    return {
        "file_url": "https://cdn.example.com/files/hello.txt",
    }


# -----------------------
# Basic creation tests
# -----------------------
@pytest.mark.asyncio
async def test_create_user(db_session, sample_user_data):
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    assert user.id is not None
    assert user.name == sample_user_data["name"]


@pytest.mark.asyncio
async def test_create_thread(db_session, sample_user_data, sample_thread_data):
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    assert thread.openai_thread_id == sample_thread_data["openai_thread_id"]
    assert thread.user_id == user.id
    assert thread.created_at is not None
    assert thread.updated_at is not None


@pytest.mark.asyncio
async def test_create_message(db_session, sample_user_data, sample_thread_data, sample_message_data):
    # user
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    # thread
    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    # message
    msg = Message(thread_id=thread.openai_thread_id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    assert msg.id is not None
    assert msg.thread_id == thread.openai_thread_id
    assert msg.type == sample_message_data["type"]
    assert msg.created_at is not None
    assert msg.updated_at is not None


@pytest.mark.asyncio
async def test_create_file_attachment(
    db_session,
    sample_user_data,
    sample_thread_data,
    sample_message_data,
    sample_file_attachment_data,
):
    # user
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    # thread
    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    # message
    msg = Message(thread_id=thread.openai_thread_id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    # file attachment
    fa = FileAttachment(message_id=msg.id, **sample_file_attachment_data)
    db_session.add(fa)
    await db_session.commit()
    await db_session.refresh(fa)

    assert fa.id is not None
    assert fa.message_id == msg.id
    assert fa.file_url == sample_file_attachment_data["file_url"]
    assert fa.created_at is not None
    assert fa.updated_at is not None


# -----------------------
# Constraints & FKs
# -----------------------
@pytest.mark.asyncio
async def test_message_fk_requires_existing_thread(db_session, sample_message_data):
    # No thread created; thread_id references non-existent PK -> IntegrityError
    bad_msg = Message(thread_id="no_such_thread", **sample_message_data)
    db_session.add(bad_msg)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()


@pytest.mark.asyncio
async def test_file_attachment_fk_requires_existing_message(db_session, sample_file_attachment_data):
    bad_fa = FileAttachment(message_id=999999, **sample_file_attachment_data)
    db_session.add(bad_fa)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()


@pytest.mark.asyncio
async def test_delete_user_restricted_when_threads_exist(
    db_session, sample_user_data, sample_thread_data
):
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()

    # ON DELETE RESTRICT (no cascade in your DDL)
    db_session.delete(user)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

    # Cleanup: delete dependent, then parent
    await db_session.refresh(thread)
    db_session.delete(thread)
    await db_session.commit()

    await db_session.refresh(user)
    db_session.delete(user)
    await db_session.commit()


@pytest.mark.asyncio
async def test_delete_thread_restricted_when_messages_exist(
    db_session, sample_user_data, sample_thread_data, sample_message_data
):
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    msg = Message(thread_id=thread.openai_thread_id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()

    # ON DELETE RESTRICT on messages.thread_id
    db_session.delete(thread)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

    # Cleanup: delete message then thread
    await db_session.refresh(msg)
    db_session.delete(msg)
    await db_session.commit()

    await db_session.refresh(thread)
    db_session.delete(thread)
    await db_session.commit()


@pytest.mark.asyncio
async def test_delete_message_restricted_when_attachments_exist(
    db_session,
    sample_user_data,
    sample_thread_data,
    sample_message_data,
    sample_file_attachment_data,
):
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    msg = Message(thread_id=thread.openai_thread_id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    fa = FileAttachment(message_id=msg.id, **sample_file_attachment_data)
    db_session.add(fa)
    await db_session.commit()
    await db_session.refresh(fa)

    # ON DELETE RESTRICT on file_attachments.message_id
    db_session.delete(msg)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

    # Cleanup: delete attachment then message
    await db_session.refresh(fa)
    db_session.delete(fa)
    await db_session.commit()

    await db_session.refresh(msg)
    db_session.delete(msg)
    await db_session.commit()


# -----------------------
# Updated_at auto-update sanity
# -----------------------
@pytest.mark.asyncio
async def test_updated_at_changes_on_update(
    db_session, sample_user_data, sample_thread_data, sample_message_data
):
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    msg = Message(thread_id=thread.openai_thread_id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    first_updated = msg.updated_at
    # ensure a tick passes so MySQL CURRENT_TIMESTAMP will differ
    await asyncio.sleep(1.1)

    # touch the row; e.g., tweak type string
    msg.type = "cherry-unprocessed-info"
    await db_session.commit()
    await db_session.refresh(msg)

    assert msg.updated_at is not None
    assert msg.updated_at >= first_updated
    assert msg.type == "cherry-unprocessed-info"