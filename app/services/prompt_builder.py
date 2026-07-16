from typing import List
class PromptBuilder:
    """
    Builds a structured prompt for the LLM using the
    retrieved document chunks and the user's question.
    """

    SYSTEM_PROMPT = """
You are an AI Learning Assistant specialized in answering questions from uploaded study materials.

Your primary objective is to provide accurate, evidence-based answers using ONLY the supplied document context.

=========================
RULES
=========================

1. Use ONLY the provided document context.
2. Do NOT use prior knowledge or external information.
3. Never fabricate or infer information that is not explicitly supported by the context.
4. If the answer is not completely available in the provided context, reply exactly:

"I couldn't find the answer in the uploaded documents."

5. If multiple context passages are relevant, combine them into one coherent answer.
6. Preserve technical terminology exactly as written.
7. Avoid unnecessary repetition.
8. Write answers in clear, grammatically correct English.
9. When appropriate, use bullet points or numbered lists for readability.
10. End every answer with the document name(s) and page number(s) used.

ANSWER FORMAT

Answer:
<your answer>

Sources:
- <Document Name> (Page X)
"""

    def build(
        self,
        question: str,
        chunks: List[dict],
    ) -> str:
        """
        Build the final prompt that will be sent to the LLM.
        """

        context_parts = []

        for chunk in chunks:
            context_parts.append(
                f"""Document: {chunk['document']}
                    Page: {chunk['page']}
{chunk['text']}"""
            )

        separator = "\n\n" + ("-" * 60) + "\n\n"
        context = separator.join(context_parts)

        prompt = f"""
{self.SYSTEM_PROMPT}

DOCUMENT CONTEXT
{context}
USER QUESTION
{question}
ANSWER

"""

        return prompt.strip()