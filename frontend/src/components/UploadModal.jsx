import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import api from "../api";

function UploadModal({ open, onClose, onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a PDF.");
            return;
        }

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post(
                "/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMessage(response.data.message);

            setFile(null);

            if (onUploadSuccess) {
                onUploadSuccess();
            }

        } catch (error) {

            setMessage(
                error.response?.data?.detail ||
                error.message ||
                "Upload failed."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div>

                        <h2 className="text-xl font-semibold">
                            Upload Document
                        </h2>

                        <p className="text-sm text-slate-500">
                            Add a PDF to your knowledge base.
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                <div className="space-y-5 p-6">

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-10 hover:border-blue-500">

                        <UploadCloud
                            size={40}
                            className="mb-3 text-slate-500"
                        />

                        <p className="font-medium">
                            Choose PDF
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Click to browse
                        </p>

                        <input
                            type="file"
                            accept=".pdf"
                            hidden
                            onChange={(e) =>
                                setFile(e.target.files[0])
                            }
                        />

                    </label>

                    {file && (
                        <div className="rounded-lg bg-slate-100 p-3 text-sm">
                            {file.name}
                        </div>
                    )}

                    {message && (
                        <div className="rounded-lg bg-slate-50 p-3 text-sm">
                            {message}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default UploadModal;