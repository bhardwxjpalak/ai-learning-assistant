from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    """
    Application configuration loaded from the .env file.
    """

    APP_NAME: str = "AI Learning Assistant"

    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1:8b"
    OLLAMA_TIMEOUT: int = 300

    # Embeddings
    EMBEDDING_MODEL: str = "BAAI/bge-base-en-v1.5"

    # Chunking
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 200

    # Retrieval
    TOP_K_INITIAL: int = 15
    TOP_K: int = 5

    SEMANTIC_WEIGHT: float = 0.7
    KEYWORD_WEIGHT: float = 0.3

    # Storage
    CHROMA_COLLECTION: str = "documents"
    CHROMA_DB_PATH: str = "chroma_db"

    UPLOAD_DIRECTORY: str = "uploads"
    DATABASE_URL: str = "sqlite:///documents.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()