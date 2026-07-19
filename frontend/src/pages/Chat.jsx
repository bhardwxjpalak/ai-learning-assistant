import { useState } from "react";
import api from "../api";

function Chat() {

    const [question, setQuestion] = useState("");
    const [agent, setAgent] = useState("knowledge");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const askQuestion = async () => {

        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }

        setLoading(true);

        try {

            const response = await api.post("/chat/", {
                question: question,
                agent:agent,
            });

            console.log(response.data);

            setMessages((prev) => [
    ...prev,
    {
        question: question,
        agent:agent,
        answer: response.data.answer,
        sources: response.data.sources,
    },
]);

setQuestion("");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Failed to get response."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="max-w-4xl">

            <h1 className="text-4xl font-bold mb-8">
                Chat with your Documents
            </h1>
            <div className="mb-6">

    <label className="block text-sm font-semibold mb-2">
        Select AI Agent
    </label>

    <select
        value={agent}
        onChange={(e) => setAgent(e.target.value)}
        className="w-full border rounded-lg p-3"
    >
        <option value="knowledge">
            Knowledge Assistant
        </option>

        <option value="summary">
            Summary Agent
        </option>

        <option value="research">
            Research Agent
        </option>
    </select>

</div>
            <textarea
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full border rounded-lg p-4"
            />

            <button
                onClick={askQuestion}
                disabled={loading}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? "Thinking..." : "Ask"}
            </button>

              <div className="mt-8 space-y-8">

    {messages.map((message, index) => (

        <div key={index} className="space-y-4">

            {/* User Message */}
            <div className="flex justify-end">

                <div className="bg-blue-600 text-white rounded-xl p-4 max-w-2xl">
                    {message.question}
                </div>

            </div>

            {/* AI Response */}
            <div className="flex justify-start">

                <div className="bg-gray-100 rounded-xl p-4 max-w-3xl whitespace-pre-wrap">
                  <p className="text-sm text-gray-500 mb-2">
            <strong>Agent:</strong> {message.agent}
        </p>
                    {message.answer}
                </div>

            </div>

            {/* Sources */}
            {message.sources.length > 0 && (

                <div className="ml-2">

                    <h3 className="font-semibold mb-2">
                        Sources
                    </h3>

                    <div className="space-y-2">

                        {message.sources.map((source, sourceIndex) => (

                            <div
                                key={sourceIndex}
                                className="border rounded-lg p-3 bg-gray-50"
                            >

                                <p>
                                    <strong>Document:</strong> {source.document}
                                </p>

                                <p>
                                    <strong>Page:</strong> {source.page}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    ))}

</div>

</div>

    );

}

export default Chat;