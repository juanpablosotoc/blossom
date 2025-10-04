import pytest
from unittest.mock import patch
from fastapi import HTTPException
from sqlalchemy import select

from cherry_blossom.users.views import create_user, delete_user
from cherry_blossom.users.schema import UserCreate

from myOrm.models import User


async def _db_gen_from_session(db_session):
    yield db_session


# -----------------------
# POST /users/ (create)
# -----------------------
@pytest.mark.asyncio
async def test_create_user_success(db_session):
    # Arrange
    payload = UserCreate(
        name="Juan Test",
        profile_picture_url="https://cdn.example.com/u/1.jpg",
        password="plain-secret",
    )

    with patch("myEncryption.Encryption.hash_password") as mock_hash:
        mock_hash.return_value = "hashed-secret"

        # Act
        new_user_id = await create_user(
            user=payload,
            db_session_a_gen=_db_gen_from_session(db_session),
        )

        # Assert
        assert isinstance(new_user_id, int)
        # Verify it was persisted
        created = (await db_session.execute(select(User).where(User.id == new_user_id))).scalar_one()
        assert created.name == "Juan Test"
        assert created.profile_picture_url == "https://cdn.example.com/u/1.jpg"
        assert created.hashed_password == "hashed-secret"
        mock_hash.assert_called_once_with("plain-secret")


# -----------------------
# DELETE /users/ (delete) — success
# -----------------------
@pytest.mark.asyncio
async def test_delete_user_success(db_session):
    # Arrange: seed a user directly via ORM
    u = User(
        name="Delete Me",
        profile_picture_url="https://cdn.example.com/u/2.jpg",
        hashed_password="$2b$12$already-hashed",
    )
    db_session.add(u)
    await db_session.commit()
    await db_session.refresh(u)
    user_id = u.id

    with patch("myEncryption.Encryption.verify_password") as mock_verify:
        mock_verify.return_value = True

        # Act
        # TODO: Test with user_db_session
        deleted_id = await delete_user(
            user_db_session=(u, db_session),
            db_session_a_gen=_db_gen_from_session(db_session),
        )

        # Assert
        assert deleted_id == user_id
        mock_verify.assert_called_once_with("$2b$12$already-hashed", "$2b$12$already-hashed")
        # Confirm it was deleted
        gone = await db_session.get(User, user_id)
        assert gone is None


# -----------------------
# DELETE /users/ — user not found
# -----------------------
@pytest.mark.asyncio
async def test_delete_user_not_found(db_session):
    with patch("myEncryption.Encryption.verify_password") as mock_verify:
        # Should not be called since user doesn't exist
        mock_verify.return_value = True

        with pytest.raises(HTTPException) as exc:
            await delete_user(
                user_db_session=(User(id=999999), db_session),
                db_session_a_gen=_db_gen_from_session(db_session),
            )

        assert exc.value.status_code == 404
        assert exc.value.detail == "User not found"
        assert mock_verify.call_count == 0


# -----------------------
# DELETE /users/ — invalid password
# -----------------------
@pytest.mark.asyncio
async def test_delete_user_invalid_password(db_session):
    # Arrange: seed a user
    u = User(
        name="Keep Me",
        profile_picture_url="https://cdn.example.com/u/3.jpg",
        hashed_password="$2b$12$already-hashed",
    )
    db_session.add(u)
    await db_session.commit()
    await db_session.refresh(u)
    user_id = u.id

    with patch("myEncryption.Encryption.verify_password") as mock_verify:
        mock_verify.return_value = False

        with pytest.raises(HTTPException) as exc:
            await delete_user(
                user_db_session=(u, db_session),
                db_session_a_gen=_db_gen_from_session(db_session),
            )

        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid password"
        mock_verify.assert_called_once_with("$2b$12$already-hashed", "$2b$12$already-hashed")

        # sanity: user still exists
        still_there = await db_session.get(User, user_id)
        assert still_there is not None
