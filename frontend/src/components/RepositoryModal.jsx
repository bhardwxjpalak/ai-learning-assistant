import { useEffect, useState } from "react";
import { X, Trash2, FileText } from "lucide-react";
import api from "../api";

function RepositoryModal({ open, onClose }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchDocuments();
        }
    }, [open]);

    const fetchDocuments = async () => {
        setLoading(true);

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

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div>
                        <h2 className="text-xl font-semibold">
                            Knowledge Repository
                        </h2>

                        <p className="text-sm text-slate-500">
                            Manage uploaded documents
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                <div className="max-h-[70vh] overflow-y-auto p-6">

                    {loading ? (

                        <p>Loading documents...</p>

                    ) : documents.length === 0 ? (

                        <p>No documents uploaded.</p>

                    ) : (

                        <div className="space-y-4">

                            {documents.map((doc) => (

                                <div
                                    key={doc.id}
                                    className="flex items-start justify-between rounded-xl border p-5"
                                >

                                    <div>

                                        <div className="flex items-center gap-2 font-semibold">

                                            <FileText size={18} />

                                            {doc.filename}

                                        </div>

                                        <div className="mt-3 text-sm text-slate-600 space-y-1">

                                            <p>Pages: {doc.total_pages}</p>

                                            <p>Chunks: {doc.total_chunks}</p>

                                            <p>Status: {doc.status}</p>

                                            <p>
                                                Uploaded:
                                                {" "}
                                                {new Date(
                                                    doc.upload_time
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        onClick={() =>
                                            deleteDocument(
                                                doc.id,
                                                doc.filename
                                            )
                                        }
                                        className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default RepositoryModal;