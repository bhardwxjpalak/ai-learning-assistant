import re

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings


class Chunker:
    """
    Paragraph-aware chunker that preserves logical sections while
    maintaining overlap between consecutive chunks.
    """

    def __init__(self):

        self.chunk_size = settings.CHUNK_SIZE
        self.chunk_overlap = settings.CHUNK_OVERLAP

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                "",
            ],
        )

    def split(self, pages: list[dict]) -> list[dict]:

        chunks = []

        for page in pages:

            # Split text into paragraphs (handles inconsistent blank lines)
            paragraphs = [
                p.strip()
                for p in re.split(r"\n\s*\n+", page["text"])
                if p.strip()
            ]

            page_chunks = []
            current_chunk = ""

            for paragraph in paragraphs:

                # If a single paragraph exceeds chunk size,
                # let RecursiveCharacterTextSplitter handle it.
                if len(paragraph) > self.chunk_size:

                    if current_chunk:
                        page_chunks.append(current_chunk.strip())
                        current_chunk = ""

                    page_chunks.extend(
                        self.text_splitter.split_text(paragraph)
                    )

                    continue

                candidate = (
                    paragraph
                    if not current_chunk
                    else current_chunk + "\n\n" + paragraph
                )

                if len(candidate) <= self.chunk_size:
                    current_chunk = candidate

                else:
                    page_chunks.append(current_chunk.strip())

                    # Paragraph-aware overlap
                    overlap_paragraphs = current_chunk.split("\n\n")
                    overlap_text = ""

                    while overlap_paragraphs:

                        candidate_overlap = "\n\n".join(overlap_paragraphs)

                        if len(candidate_overlap) <= self.chunk_overlap:
                            overlap_text = candidate_overlap
                            break

                        overlap_paragraphs.pop(0)

                    current_chunk = (
                        paragraph
                        if not overlap_text
                        else overlap_text + "\n\n" + paragraph
                    )

            if current_chunk:
                page_chunks.append(current_chunk.strip())

            for chunk_id, chunk_text in enumerate(page_chunks):

                chunks.append(
                    {
                        "page": page["page"],
                        "chunk_id": chunk_id,
                        "text": chunk_text,
                    }
                )

        return chunks