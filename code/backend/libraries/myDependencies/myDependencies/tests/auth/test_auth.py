import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from jwt.exceptions import InvalidTokenError

from myDependencies.auth import validate_is_authenticated
from myOrm import User


# -----------------------
# Helpers
# -----------------------
async def _db_gen_from_session(session):
    """Helper to wrap a mock AsyncSession into a generator that yields it."""
    yield session


# -----------------------
# Fixtures
# -----------------------
@pytest.fixture
def mock_db_session():
    """
    AsyncSession-like mock. execute(...) is awaited and returns a result object
    with scalar_one_or_none().
    """
    session = AsyncMock(spec=AsyncSession)

    # Default: no row found
    default_result = MagicMock()
    default_result.scalar_one_or_none.return_value = None
    session.execute.return_value = default_result

    return session


@pytest.fixture
def mock_user():
    u = User()
    u.id = 1
    u.name = "Juan Test"
    return u


# -----------------------
# Tests
# -----------------------
@pytest.mark.asyncio
async def test_validate_is_authenticated_success(mock_db_session, mock_user):
    valid_token = "valid_token"

    result = MagicMock()
    result.scalar_one_or_none.return_value = mock_user
    mock_db_session.execute.return_value = result

    with patch("myDependencies.auth.Encryption.verify_token") as mock_verify:
        mock_verify.return_value = {"user_id": 1}

        user = await validate_is_authenticated(
            db_session_a_gen=_db_gen_from_session(mock_db_session),
            token=valid_token,
        )

        assert user is mock_user
        mock_verify.assert_called_once_with(valid_token)
        mock_db_session.execute.assert_called_once()
        assert mock_db_session.execute.await_count == 1


@pytest.mark.asyncio
async def test_validate_is_authenticated_invalid_token(mock_db_session):
    invalid_token = "invalid_token"

    with patch("myDependencies.auth.Encryption.verify_token") as mock_verify:
        mock_verify.side_effect = InvalidTokenError()

        with pytest.raises(HTTPException) as exc:
            await validate_is_authenticated(
                db_session_a_gen=_db_gen_from_session(mock_db_session),
                token=invalid_token,
            )

        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid token"
        mock_verify.assert_called_once_with(invalid_token)
        assert mock_db_session.execute.await_count == 0


@pytest.mark.asyncio
async def test_validate_is_authenticated_user_not_found(mock_db_session):
    valid_token = "valid_token"

    with patch("myDependencies.auth.Encryption.verify_token") as mock_verify:
        mock_verify.return_value = {"user_id": 1}

        with pytest.raises(HTTPException) as exc:
            await validate_is_authenticated(
                db_session_a_gen=_db_gen_from_session(mock_db_session),
                token=valid_token,
            )

        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid token"
        mock_verify.assert_called_once_with(valid_token)
        assert mock_db_session.execute.await_count == 1