from typing import List


class PromptBuilder:
    """
    Builds the final prompt by combining:

    - Agent system prompt
    - Retrieved document context
    - User question
    """

    def build(
        self,
        system_prompt: str,
        question: str,
        chunks: List[dict],
    ) -> str:
        """
        Build the final prompt sent to the LLM.
        """

        context_parts = []

        for chunk in chunks:
            context_parts.append(
                f"""Document: {chunk['document']}
Page: {chunk['page']}

{chunk['text']}"""
            )

        context = "\n\n" + ("-" * 60) + "\n\n".join(context_parts)

        prompt = f"""
{system_prompt}

=========================
DOCUMENT CONTEXT
=========================

{context}

=========================
USER REQUEST
=========================

{question}

=========================
RESPONSE
=========================
"""

        return prompt.strip()