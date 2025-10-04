from pydantic import BaseModel

# create user schema
class UserCreate(BaseModel):
    name: str
    profile_picture_url: str
    password: str
