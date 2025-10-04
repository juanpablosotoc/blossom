from fastapi import APIRouter

from myOrm.models import User
from myEncryption import Encryption
from .schema import UserCreate
from myDependencies import DBSessionDep, AuthDep
from myEncryption import Encryption

users_route = APIRouter(prefix="/users", tags=["users"])

# Create user
@users_route.post("/")
async def create_user(user: UserCreate, db_session: DBSessionDep):
    hashed_password = Encryption.hash_password(user.password)
    new_user = User(
        name=user.name,
        profile_picture_url=user.profile_picture_url,
        hashed_password=hashed_password,
    )
    db_session.add(new_user)
    await db_session.commit()
    await db_session.refresh(new_user)

    jwt_token = Encryption.generate_token({"user_id": new_user.id})
    return {"user_id": new_user.id, "jwt_token": jwt_token}


# Delete user
@users_route.delete("/")
async def delete_user(user_db_session: AuthDep):
    user = user_db_session[0]
    db_session = user_db_session[1]

    await db_session.delete(user)
    await db_session.commit()
    return {"message": "User deleted successfully"}