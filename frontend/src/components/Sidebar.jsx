import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    MessageSquare,
    BookOpen,
    Upload,
    Sparkles,
    Plus,
} from "lucide-react";

import { useChat } from "../context/ChatContext";

const menuItems = [
    {
        title: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },
    {
        title: "AI Workspace",
        path: "/chat",
        icon: MessageSquare,
    },
    {
        title: "Knowledge Repository",
        path: "/knowledge-base",
        icon: BookOpen,
    },
    {
        title: "Upload Assets",
        path: "/upload",
        icon: Upload,
    },
];

function Sidebar() {
    const navigate = useNavigate();

    const {
        conversations,
        activeConversationId,
        createConversation,
        switchConversation,
    } = useChat();

    const handleNewChat = () => {
        createConversation();
        navigate("/chat");
    };

    const handleConversationClick = (conversationId) => {
        switchConversation(conversationId);
        navigate("/chat");
    };

    return (
        <aside className="w-72 h-screen bg-slate-950 text-white flex flex-col border-r border-slate-800">
            {/* Brand */}

            <div className="px-6 py-8 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-xl font-bold">
                        KT
                    </div>

                    <div>
                        <h2 className="text-lg font-bold">
                            Kortex AI
                        </h2>

                        <p className="text-xs text-slate-400">
                            Enterprise Platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Navigation */}

                <nav className="px-4 py-6">

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-xl mb-3 transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "text-slate-300 hover:bg-slate-900 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={20} />

                                <span className="font-medium">
                                    {item.title}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Conversations */}

                <div className="border-t border-slate-800 flex flex-col flex-1 min-h-0">

                    <div className="p-4">

                        <button
                            onClick={handleNewChat}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-3 font-medium"
                        >
                            <Plus size={18} />
                            New Chat
                        </button>

                    </div>

                    <div className="px-4 pb-2">

                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            Recent Chats
                        </p>

                    </div>

                    <div className="flex-1 overflow-y-auto px-2 pb-4">

                        {conversations.length === 0 ? (

                            <div className="px-4 py-6 text-sm text-slate-500">
                                No conversations yet.
                            </div>

                        ) : (

                            conversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() =>
                                        handleConversationClick(
                                            conversation.id
                                        )
                                    }
                                    className={`w-full text-left rounded-xl px-4 py-3 mb-2 transition-all ${
                                        activeConversationId === conversation.id
                                            ? "bg-slate-800 border border-blue-500"
                                            : "hover:bg-slate-900 border border-transparent"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">

                                        <MessageSquare
                                            size={16}
                                            className="text-slate-400 flex-shrink-0"
                                        />

                                        <div className="min-w-0 flex-1">

                                            <p className="text-sm font-medium truncate">
                                                {conversation.title}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {conversation.messages.length}{" "}
                                                message
                                                {conversation.messages.length !== 1
                                                    ? "s"
                                                    : ""}
                                            </p>

                                        </div>

                                    </div>
                                </button>
                            ))

                        )}

                    </div>

                </div>

            </div>

            {/* Footer */}

            <div className="p-5 border-t border-slate-800">

                <div className="flex items-center gap-3">

                    <Sparkles
                        size={18}
                        className="text-blue-400"
                    />

                    <div>

                        <p className="text-sm font-medium">
                            AI Powered
                        </p>

                        <p className="text-xs text-slate-400">
                            Enterprise Edition
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;