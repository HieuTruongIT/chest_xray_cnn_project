import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MODEL_PATH: str = os.getenv("MODEL_PATH", "gpt2")
    MAX_LENGTH: int = int(os.getenv("MAX_LENGTH", 500))
    SERVER_PORT: int = int(os.getenv("SERVER_PORT", 8000)) 

settings = Settings()
