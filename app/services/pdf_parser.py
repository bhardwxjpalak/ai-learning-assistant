from typing import List, Dict
import fitz


class PDFParser:
    """
    Extracts text from a PDF while preserving page numbers
    and basic document structure.
    """

    def parse(self, file_path: str) -> List[Dict]:

        pages = []

        pdf = fitz.open(file_path)

        try:

            for page_number, page in enumerate(pdf, start=1):

                blocks = page.get_text("blocks")

                lines = []

                for block in sorted(blocks, key=lambda b: (b[1], b[0])):

                    text = block[4].strip()

                    if text:
                        lines.append(text)

                page_text = "\n\n".join(lines)

                if page_text.strip():

                    pages.append(
                        {
                            "page": page_number,
                            "text": page_text,
                        }
                    )

        finally:
            pdf.close()

        return pages