import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (

        <div className="flex flex-col items-center justify-center h-full text-center px-8">

            <div className="mb-8">

                <h1 className="text-6xl font-bold text-slate-900 mb-4">
                    Kortex AI
                </h1>

                <p className="text-2xl text-slate-700 mb-3">
                    Enterprise Knowledge Intelligence Platform
                </p>

                <p className="text-gray-500 max-w-3xl">
                    Search, analyze, summarize, and research organizational
                    knowledge using AI powered retrieval and intelligent agents.
                </p>

            </div>

            <button
                onClick={() => navigate("/upload")}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            >
                Upload Knowledge Assets
            </button>

        </div>

    );
}

export default Home;