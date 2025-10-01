import json
from myAws import SecretsManager


class Config:
    JWT_SECRET_KEY = json.loads(SecretsManager.get_secret("JWT_SECRET_KEY"))["SECRET"]
    JWT_ALGORITHM = "HS256"
