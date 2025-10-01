import os
from myExceptions.boot import ConfigurationError


class Config:
    REQUIRED_ENV_VARS = ['OPENAI_API_KEY']
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')


    for var in REQUIRED_ENV_VARS: 
        if os.getenv(var) is None: raise ConfigurationError(f'{var} is not set')
