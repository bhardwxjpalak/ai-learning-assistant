import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function getAgentName(agent) {
    switch (agent) {
        case "knowledge":
            return "Knowledge Assistant";
        case "summary":
            return "Executive Summary";
        case "research":
            return "Research Analyst";
        default:
            return "AI Assistant";
    }
}

function Message({ message }) {
    return (
        <div className="space-y-5">

            {/* User */}

            <div className="flex justify-end">
                <div className="max-w-3xl rounded-2xl bg-blue-600 px-5 py-3 text-white shadow-sm">
                    <p className="whitespace-pre-wrap">
                        {message.question}
                    </p>
                </div>
            </div>

            {/* Assistant */}

            <div className="flex justify-start">
                <div className="max-w-4xl">

                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mb-3">
                        {getAgentName(message.agent)}
                    </span>

                    <div className="rounded-2xl bg-white border border-slate-200 px-6 py-5 shadow-sm">

                        <div className="prose prose-slate max-w-none">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.answer || ""}
    </ReactMarkdown>
</div>

                    </div>

                </div>
            </div>

        </div>
    );
}

export default Message;