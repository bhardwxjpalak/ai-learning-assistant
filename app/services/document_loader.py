import fitz
class DocumentLoader:
    """
    Loads PDF documents using PyMuPDF.
    """
    def load_pdf(self, file_path: str) -> str:
        pdf = fitz.open(file_path)

        try:
            text = []
            for page in pdf:
                text.append(page.get_text())
            return "\n".join(text)

        finally:
            pdf.close()