import { useState, useRef, useEffect } from "react";
import api from "../api";
import ChatBox from "../components/ChatBox";
import Message from "../components/Message";
import UploadModal from "../components/UploadModal";
import RepositoryModal from "../components/RepositoryModal";

function Chat() {
    const [question, setQuestion] = useState("");
    const [agent, setAgent] = useState("knowledge");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [repositoryOpen, setRepositoryOpen] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const askQuestion = async () => {
        if (!question.trim()) return;

        setLoading(true);

        try {
            const response = await api.post("/chat/", {
                question,
                agent,
            });

            setMessages((prev) => [
                ...prev,
                {
                    question,
                    agent,
                    answer: response.data.answer,
                },
            ]);

            setQuestion("");

        } catch (error) {

            alert(
                error.response?.data?.detail ||
                "Failed to get response."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
    <>
        <div className="h-[calc(100vh-120px)] flex flex-col">

            {/* Conversation */}

            <div className="flex-1 overflow-y-auto">

                {messages.length === 0 ? (

                    <div className="h-full flex flex-col items-center justify-center text-center">

                        <h1 className="text-5xl font-bold text-slate-900 mb-4">
                            KnowledgeHub AI
                        </h1>

                        <p className="text-xl text-slate-600 mb-3">
                            Enterprise Knowledge Intelligence Platform
                        </p>

                        <p className="text-slate-500 max-w-2xl leading-7">
                            Search, analyze, summarize and research your
                            organizational knowledge using intelligent AI
                            agents powered by Retrieval Augmented Generation.
                        </p>

                        <div className="mt-12 text-slate-400">
                            How can I help you today?
                        </div>

                    </div>

                ) : (

                    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">

                        {messages.map((message, index) => (
                            <Message
                                key={index}
                                message={message}
                            />
                        ))}

                        <div ref={bottomRef} />

                    </div>

                )}

            </div>

            {/* Fixed Input */}

            <div className="pt-2">
                <div className="max-w-6xl mx-auto">
                    <ChatBox
                        question={question}
                        setQuestion={setQuestion}
                        agent={agent}
                        setAgent={setAgent}
                        loading={loading}
                        askQuestion={askQuestion}
                        onUpload={() => setUploadOpen(true)}
                        onRepository={() => setRepositoryOpen(true)}
                    />
                </div>
            </div>

        </div>

        {/* Upload Modal */}

        <UploadModal
            open={uploadOpen}
            onClose={() => setUploadOpen(false)}
            onUploadSuccess={() => {
                setUploadOpen(false);
            }}
        />
        <RepositoryModal
    open={repositoryOpen}
    onClose={() => setRepositoryOpen(false)}
        />
    </>
    
);
}
export default Chat;