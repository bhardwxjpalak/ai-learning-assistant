from app.services.indexing_service import IndexingService

indexer = IndexingService()

indexer.index_document(
    file_path="uploads/Propostional_logic.pdf",
    document_name="Propostional_logic.pdf",
)

print("Indexing Complete")