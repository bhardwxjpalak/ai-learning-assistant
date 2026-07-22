import { useState, useRef, useEffect } from "react";
import api from "../api";
import ChatBox from "../components/ChatBox";
import Message from "../components/Message";
import UploadModal from "../components/UploadModal";
import RepositoryModal from "../components/RepositoryModal";
import { useChat } from "../context/ChatContext";

function Chat() {
    const [question, setQuestion] = useState("");
    const [agent, setAgent] = useState("knowledge");
    const [loading, setLoading] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [repositoryOpen, setRepositoryOpen] = useState(false);

    const {
        activeConversation,
        updateConversation,
        autoRenameConversation,
    } = useChat();

    const messages = activeConversation?.messages || [];

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const askQuestion = async () => {
        if (!question.trim() || !activeConversation) return;

        const currentQuestion = question;
        const currentAgent = agent;
        const isFirstMessage = activeConversation.messages.length === 0;
        setQuestion("");
        setLoading(true);

        // Add loading message
        updateConversation(activeConversation.id, (conversation) => ({
            ...conversation,
            updatedAt: new Date().toISOString(),
            messages: [
                ...conversation.messages,
                {
                    question: currentQuestion,
                    agent: currentAgent,
                    answer: "",
                    loading: true,
                },
            ],
        }));
        if (isFirstMessage) {autoRenameConversation(
        activeConversation.id,
        currentQuestion
    );
    }
        try {
            const response = await api.post("/chat/", {
                question: currentQuestion,
                agent: currentAgent,
            });

            updateConversation(activeConversation.id, (conversation) => {
                const updatedMessages = [...conversation.messages];

                updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    answer: response.data.answer,
                    loading: false,
                };

                return {
                    ...conversation,
                    updatedAt: new Date().toISOString(),
                    messages: updatedMessages,
                };
            });

        } catch (error) {

            updateConversation(activeConversation.id, (conversation) => {
                const updatedMessages = [...conversation.messages];

                updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    answer:
                        error.response?.data?.detail ||
                        "Failed to get response.",
                    loading: false,
                };

                return {
                    ...conversation,
                    updatedAt: new Date().toISOString(),
                    messages: updatedMessages,
                };
            });

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
            <div className="h-full flex flex-col min-h-0">

                {/* Conversation */}

                <div className="flex-1 overflow-y-auto px-2 pb-40">

                    {/* Hero */}

                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            messages.length === 0
                                ? "opacity-100 max-h-[500px]"
                                : "opacity-0 max-h-0 pointer-events-none"
                        }`}
                    >
                        <div className="max-w-5xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
                            <h1 className="text-4xl font-bold text-slate-900 mb-3">
                                Kortex AI
                            </h1>

                            <p className="text-lg text-slate-600 mb-2">
                                Enterprise Knowledge Intelligence Platform
                            </p>

                            <p className="text-slate-500 max-w-xl leading-7">
                                Search, analyze, summarize and research your
                                organizational knowledge using intelligent AI
                                agents powered by Retrieval Augmented Generation.
                            </p>

                            <div className="mt-8 text-slate-400 text-sm font-medium">
                                How can I help you today?
                            </div>

                        </div>

                    </div>

                    {/* Messages */}

                    {messages.length > 0 && (

                        <div className="max-w-5xl mx-auto py-6 px-8 space-y-8">

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

                <div className="sticky bottom-0 z-20 bg-slate-100 pt-4 pb-2">

                    <div className="max-w-5xl mx-auto ">

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