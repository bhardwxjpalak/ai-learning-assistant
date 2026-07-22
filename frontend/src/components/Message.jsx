import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
    const [copied, setCopied] = useState(false);

    const copyResponse = async () => {
        if (!message.answer) return;

        try {
            await navigator.clipboard.writeText(message.answer);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

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

                <div className="max-w-4xl w-full">

                    {/* Agent Badge */}

                    <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-3">

                        {getAgentName(message.agent)}

                    </span>

                    {/* Response Card */}

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

                            <span className="text-sm font-semibold text-slate-700">
                                Response
                            </span>

                            {!message.loading && (

                                <button
                                    onClick={copyResponse}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
                                >

                                    {copied ? (
                                        <>
                                            <Check size={16} />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            Copy
                                        </>
                                    )}

                                </button>

                            )}

                        </div>

                        {/* Content */}

                        <div className="px-6 py-6">

                            {message.loading ? (

                                <div className="flex items-center gap-3 text-slate-500">

                                    <div className="flex gap-1">

                                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></span>

                                        <span
                                            className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                                            style={{ animationDelay: "0.15s" }}
                                        ></span>

                                        <span
                                            className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                                            style={{ animationDelay: "0.3s" }}
                                        ></span>

                                    </div>

                                    <span className="font-medium">
                                        Thinking...
                                    </span>

                                </div>

                            ) : (

                                <div
                                    className="
                                        prose
                                        prose-slate
                                        max-w-none
                                        prose-headings:font-semibold
                                        prose-headings:text-slate-900
                                        prose-p:leading-8
                                        prose-li:leading-8
                                        prose-code:text-blue-600
                                        prose-code:before:content-none
                                        prose-code:after:content-none
                                    "
                                >

                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.answer || ""}
                                    </ReactMarkdown>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Message;