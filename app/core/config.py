from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    """
    Application configuration loaded from the .env file.
    """

    APP_NAME: str = "AI Learning Assistant"

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1:8b"
    OLLAMA_TIMEOUT: int = 300
    EMBEDDING_MODEL: str = "BAAI/bge-base-en-v1.5"
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 200

    TOP_K: int = 5

    CHROMA_COLLECTION: str = "documents"
    CHROMA_DB_PATH: str = "chroma_db"
    UPLOAD_DIRECTORY: str = "uploads"
    DATABASE_URL: str = "sqlite:///documents.db"
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()