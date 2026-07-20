import { Plus, Eye, Send, ChevronDown } from "lucide-react";

function ChatBox({
    question,
    setQuestion,
    agent,
    setAgent,
    loading,
    askQuestion,
    onUpload,
    onRepository,
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">

            {/* Top Toolbar */}

            <div className="flex items-center justify-between mb-3">

                <div className="flex items-center gap-2">

                    <button
                        title="Upload Knowledge Assets"
                        onClick={onUpload}
                        className="p-2 rounded-lg hover:bg-slate-100 transition"
                    >
                        <Plus size={20} />
                    </button>

                    <button
                        title="Knowledge Repository"
                        onClick={onRepository}
                        className="p-2 rounded-lg hover:bg-slate-100 transition"
                    >
                        <Eye size={20} />
                    </button>

                </div>

                <div className="relative">

                    <select
                        value={agent}
                        onChange={(e) => setAgent(e.target.value)}
                        className="appearance-none bg-slate-100 hover:bg-slate-200 transition rounded-lg py-2 pl-4 pr-10 text-sm font-medium outline-none cursor-pointer"
                    >
                        <option value="knowledge">
                            Knowledge Assistant
                        </option>

                        <option value="summary">
                            Executive Summary
                        </option>

                        <option value="research">
                            Research Analyst
                        </option>

                    </select>

                    <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
                    />

                </div>

            </div>

            {/* Input */}

            <div className="flex items-end gap-3">

                <textarea
                    rows={2}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about your knowledge..."
                    className="flex-1 resize-none border-0 outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();

                            if (!loading) {
                                askQuestion();
                            }
                        }
                    }}
                />

                <button
                    onClick={askQuestion}
                    disabled={loading}
                    className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white flex items-center justify-center transition"
                >
                    <Send size={18} />
                </button>

            </div>

        </div>
    );
}

export default ChatBox;