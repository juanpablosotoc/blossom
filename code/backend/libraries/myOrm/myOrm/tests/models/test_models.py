import pytest
from sqlalchemy.exc import IntegrityError, StatementError

from myOrm.models import User, ProfileImage, Thread, Message, Asset


# -----------------------
# Sample data fixtures
# -----------------------
@pytest.fixture
def sample_user_data():
    return {
        "name": "Juan Test",
    }


@pytest.fixture
def sample_profile_image_data():
    return {
        "thumbnail_s3_name": "users/1/thumb.jpg",
        "normal_s3_name": "users/1/normal.jpg",
    }


@pytest.fixture
def sample_thread_data():
    return {
        "name": "General",
        "ai_name": "BlossomAI",
    }


@pytest.fixture
def sample_message_data():
    return {
        "content": "Hello world",
        "sender": "user",  # valid enum
    }


@pytest.fixture
def sample_asset_data():
    return {
        "s3_name": "assets/hello.txt",
        "file_type": "text/plain",
        "size": 1234,
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
    assert user.created_at is not None  # server_default timestamp


@pytest.mark.asyncio
async def test_create_profile_image(db_session, sample_user_data, sample_profile_image_data):
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    pi = ProfileImage(user_id=user.id, **sample_profile_image_data)
    db_session.add(pi)
    await db_session.commit()
    await db_session.refresh(pi)

    assert pi.user_id == user.id
    assert pi.thumbnail_s3_name == sample_profile_image_data["thumbnail_s3_name"]
    assert pi.normal_s3_name == sample_profile_image_data["normal_s3_name"]


@pytest.mark.asyncio
async def test_create_thread_and_message(db_session, sample_user_data, sample_thread_data, sample_message_data):
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    assert thread.id is not None
    assert thread.user_id == user.id
    assert thread.created_at is not None

    msg = Message(thread_id=thread.id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    assert msg.id is not None
    assert msg.thread_id == thread.id
    assert msg.sender == "user"
    assert msg.created_at is not None


@pytest.mark.asyncio
async def test_create_asset(db_session, sample_user_data, sample_thread_data, sample_message_data, sample_asset_data):
    # Setup: user -> thread -> message
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    msg = Message(thread_id=thread.id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    asset = Asset(message_id=msg.id, **sample_asset_data)
    db_session.add(asset)
    await db_session.commit()
    await db_session.refresh(asset)

    assert asset.id is not None
    assert asset.message_id == msg.id
    assert asset.created_at is not None


# -----------------------
# Constraints & FKs
# -----------------------
@pytest.mark.asyncio
async def test_message_sender_enum_validation(db_session, sample_user_data, sample_thread_data):
    # Invalid enum should raise before/at commit
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    bad_msg = Message(thread_id=thread.id, content="oops", sender="system")  # invalid
    db_session.add(bad_msg)

    # Depending on dialect, this could surface as StatementError (enum coercion) or IntegrityError
    with pytest.raises((StatementError, IntegrityError)):
        await db_session.commit()
    await db_session.rollback()


@pytest.mark.asyncio
async def test_profile_image_restricts_user_delete(
    db_session, sample_user_data, sample_profile_image_data
):
    # Create user + profile image (FK RESTRICT)
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    pi = ProfileImage(user_id=user.id, **sample_profile_image_data)
    db_session.add(pi)
    await db_session.commit()

    # Attempt to delete user first -> should fail due to ON DELETE RESTRICT
    db_session.delete(user)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

    # Delete profile image, then user -> should succeed
    await db_session.refresh(user)
    await db_session.refresh(pi)
    db_session.delete(pi)
    await db_session.commit()

    db_session.delete(user)
    await db_session.commit()


@pytest.mark.asyncio
async def test_delete_user_cascades_threads_and_messages(
    db_session, sample_user_data, sample_thread_data, sample_message_data
):
    # Setup: user -> thread -> message
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    # Ensure no profile_image exists so delete is not RESTRICTed
    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    msg = Message(thread_id=thread.id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    # Deleting user should cascade to threads -> messages (DB has ON DELETE CASCADE)
    db_session.delete(user)
    await db_session.commit()

    # Verify thread/message are gone (query expects no rows)
    # Note: using scalar_one_or_none requires SELECT; keeping simple existence checks
    t = await db_session.get(Thread, thread.id)
    m = await db_session.get(Message, msg.id)
    assert t is None
    assert m is None


@pytest.mark.asyncio
async def test_asset_restricts_message_delete_then_ok_after_asset_delete(
    db_session, sample_user_data, sample_thread_data, sample_message_data, sample_asset_data
):
    # Setup: user -> thread -> message -> asset
    user = User(**sample_user_data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    thread = Thread(user_id=user.id, **sample_thread_data)
    db_session.add(thread)
    await db_session.commit()
    await db_session.refresh(thread)

    msg = Message(thread_id=thread.id, **sample_message_data)
    db_session.add(msg)
    await db_session.commit()
    await db_session.refresh(msg)

    asset = Asset(message_id=msg.id, **sample_asset_data)
    db_session.add(asset)
    await db_session.commit()
    await db_session.refresh(asset)

    # Try to delete message while asset exists -> should fail due to ON DELETE RESTRICT
    db_session.delete(msg)
    with pytest.raises(IntegrityError):
        await db_session.commit()
    await db_session.rollback()

    # Delete asset, then message -> should succeed
    await db_session.refresh(msg)
    await db_session.refresh(asset)
    db_session.delete(asset)
    await db_session.commit()

    db_session.delete(msg)
    await db_session.commit()

    # Final sanity: thread still exists
    t = await db_session.get(Thread, thread.id)
    assert t is not None