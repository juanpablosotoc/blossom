from typing import Annotated
from fastapi import Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from jwt.exceptions import InvalidTokenError

from myDependencies.core import DBSessionDep
from myEncryption import Encryption
from myOrm import User

async def validate_is_authenticated(
    db_session: DBSessionDep,
    authorization: str = Header(..., alias="Authorization"),
) -> tuple[User, AsyncSession]:
    # Expect: Authorization: Bearer <token>
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    jwt_token = authorization.split(" ", 1)[1].strip()
    if not jwt_token:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        payload = Encryption.verify_token(jwt_token)
        result = await db_session.execute(
            select(User).where(User.id == payload["user_id"])
        )
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user, db_session
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

AuthDep = Annotated[tuple[User, AsyncSession], Depends(validate_is_authenticated)]