from typing import List


class PromptBuilder:
    """
    Builds the final prompt sent to the LLM.
    """

    def build(
        self,
        system_prompt: str,
        question: str,
        chunks: List[dict],
    ) -> str:

        context_parts = []

        for chunk in chunks:
            context_parts.append(
                chunk["text"]
            )

        context = "\n\n".join(context_parts)

        prompt = f"""
{system_prompt}

=========================
KNOWLEDGE BASE
=========================

{context}

=========================
USER QUESTION
=========================

{question}

=========================
INSTRUCTIONS
=========================

Answer ONLY using the provided knowledge.

Formatting Rules:

- Return plain text only.
- Do NOT use Markdown.
- Do NOT use #, ##, ### headings.
- Do NOT use **, *, _, or backticks.
- Do NOT use Markdown tables.
- Do NOT use horizontal separators.
- Keep the answer concise and well structured.

Organize the answer in this format:

Title

Definition:
...

Explanation:
...

Example:
...

Key Points:
• Point 1
• Point 2
• Point 3

If a truth table or comparison is required, format it as aligned plain text.

STRICT RULES

- Do NOT mention the document name.
- Do NOT mention page numbers.
- Do NOT mention where the information came from.
- Do NOT create a Sources section.
- Do NOT say "According to the document..."
- If the answer is not present in the context, reply exactly:
STRICTLY FOLLOW THESE RULES:

- Never include a "Sources" section.
- Never mention page numbers.
- Never mention document names.
- Never mention where the answer came from.
- Never say "According to the document..."
- Never cite references.
- Output ONLY the answer.

I couldn't find that information in the uploaded knowledge base.

=========================
ANSWER
=========================
"""

        return prompt.strip()