from typing import List, Dict
import fitz
from app.core.logger import logger
class PDFParser:
    """
    Extracts text from a PDF while preserving page numbers.
    """

    def parse(self, file_path: str) -> List[Dict]:
        pages = []

        pdf = fitz.open(file_path)

        try:
            for page_number, page in enumerate(pdf, start=1):
                text = page.get_text().strip()

                if text:
                    pages.append(
                        {
                            "page": page_number,
                            "text": text,
                        }
                    )
        finally:
            pdf.close()
        
        return pages