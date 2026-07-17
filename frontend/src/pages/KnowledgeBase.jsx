import { useEffect, useState } from "react";
import api from "../api";

function KnowledgeBase() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get("/documents/");
            setDocuments(response.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load documents.");
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id, filename) => {

        const confirmDelete = window.confirm(
            `Delete "${filename}"?`
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/documents/${id}`);

            setDocuments((prev) =>
                prev.filter((doc) => doc.id !== id)
            );

        } catch (error) {

            console.error(error);

            alert("Failed to delete document.");
        }
    };

    if (loading) {
        return <h2>Loading documents...</h2>;
    }

    return (
        <div className="max-w-5xl">

            <h1 className="text-4xl font-bold mb-8">
                Knowledge Base
            </h1>

            {documents.length === 0 ? (
                <p>No documents uploaded yet.</p>
            ) : (
                <div className="space-y-6">

                    {documents.map((doc) => (

                        <div
                            key={doc.id}
                            className="border rounded-xl p-6 shadow-sm bg-white"
                        >

                            <div className="flex justify-between items-start">

                                <div>

                                    <h2 className="text-2xl font-semibold mb-4">
                                        📄 {doc.filename}
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">

                                        <p>
                                            <strong>Pages:</strong> {doc.total_pages}
                                        </p>

                                        <p>
                                            <strong>Chunks:</strong> {doc.total_chunks}
                                        </p>

                                        <p>
                                            <strong>Status:</strong> {doc.status}
                                        </p>

                                        <p>
                                            <strong>Uploaded:</strong>{" "}
                                            {new Date(doc.upload_time).toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                                <button
                                    onClick={() =>
                                        deleteDocument(doc.id, doc.filename)
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default KnowledgeBase;