import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (

        <div className="flex flex-col items-center justify-center h-full">

            <h1 className="text-5xl font-bold mb-4 text-slate-800">
                AI Learning Assistant
            </h1>

            <p className="text-xl text-gray-600 mb-2">
                Upload PDFs • Ask Questions • Learn Faster
            </p>

            <p className="text-gray-500 mb-10">
                Turn your study material into an intelligent AI tutor.
            </p>

            <button
                onClick={() => navigate("/upload")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
            >
                Upload Documents
            </button>

        </div>

    );
}

export default Home;