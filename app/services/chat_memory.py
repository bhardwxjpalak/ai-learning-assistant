from langchain.memory import ChatMessageHistory
class ChatMemory:
    """
    Maintains the conversation history for a chat session.
    """

    def __init__(self) -> None:
        self.history = ChatMessageHistory()

    def add_user_message(self, message: str) -> None:
        self.history.add_user_message(message)

    def add_ai_message(self, message: str) -> None:
        self.history.add_ai_message(message)

    def get_history(self) -> str:
        """
        Returns the conversation history formatted as text.
        """

        conversation = []

        for message in self.history.messages:
            role = "User" if message.type == "human" else "Assistant"

            conversation.append(
                f"{role}: {message.content}"
            )

        return "\n".join(conversation)

    def clear(self) -> None:
        """
        Clears the conversation history.
        """
        self.history.clear()