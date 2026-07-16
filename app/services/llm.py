import requests
from app.core.config import settings
from app.core.logger import logger

class LLMService:
    """
    Handles communication with the local Ollama server.
    """

    def __init__(self) -> None:
        self.base_url = f"{settings.OLLAMA_BASE_URL}/api/generate"
        self.model = settings.OLLAMA_MODEL
        self.timeout = settings.OLLAMA_TIMEOUT

    def generate(self, prompt: str) -> str:
        """
        Generate a response from the configured Ollama model.
        """

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }

        try:
            response = requests.post(
                self.base_url,
                json=payload,
                timeout=self.timeout,
            )

            response.raise_for_status()
            logger.info("Received response from Ollama model '%s'.", self.model,)

        except requests.exceptions.RequestException as e:
            logger.exception("Failed to communicate with Ollama.")
            raise RuntimeError(
                f"Failed to communicate with Ollama: {e}"
            )

        data = response.json()

        return data["response"]