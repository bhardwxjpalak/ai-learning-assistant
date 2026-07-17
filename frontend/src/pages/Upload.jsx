import { useState } from "react";
import api from "../api";

function Upload() {

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleUpload = async () => {

        if (!file) {
            setMessage("Please select a PDF.");
            return;
        }

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

        } catch (error) {

    console.log("Upload Error:", error);
    console.log("Response:", error.response);
    console.log("Data:", error.response?.data);

    setMessage(
        error.response?.data?.detail ||
        error.message ||
        "Upload failed."
    );


            setMessage(
                error.response?.data?.detail ||
                "Upload failed."
            );

        }

    };

    return (

        <div className="max-w-2xl">

            <h1 className="text-4xl font-bold mb-8">
                Upload PDF
            </h1>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-6"
            />

            <br />

            <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
                Upload
            </button>

            <p className="mt-6 text-lg">
                {message}
            </p>

        </div>

    );
}

export default Upload;