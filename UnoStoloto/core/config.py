from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).parent.parent

class Setting(BaseSettings):
    db_url: str = "postgresql+asyncpg://dbuser:BAW36YKi@localhost:5432/postgresdb"
    db_echo: bool = True

settings = Setting()