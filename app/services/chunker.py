from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings
from app.core.logger import logger
class Chunker:
    """
    Splits parsed PDF pages into overlapping text chunks while
    preserving page metadata.
    """

    def __init__(self,) -> None:

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ],
        )

    def split(self, pages: list[dict]) -> list[dict]:
        """
        Convert page-wise text into chunks.

        Parameters
        ----------
        pages : list
            Output of PDFParser.

        Returns
        -------
        list
            List of chunks with metadata.
        """

        chunks = []

        for page in pages:

            texts = self.text_splitter.split_text(page["text"])

            for chunk_id, text in enumerate(texts):

                chunks.append(
                    {
                        "page": page["page"],
                        "chunk_id": chunk_id,
                        "text": text,
                    }
                )
        
        return chunks