from abc import ABC, abstractmethod
class BaseAgent(ABC):

    @abstractmethod
    def get_system_prompt(self) -> str:
        pass