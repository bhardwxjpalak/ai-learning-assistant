import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

const ChatContext = createContext(null);

const createConversationObject = () => ({
    id: crypto.randomUUID(),
    title: "New Chat",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
});

export function ChatProvider({ children }) {
    const firstConversation = createConversationObject();

    const [conversations, setConversations] = useState([
        firstConversation,
    ]);

    const [activeConversationId, setActiveConversationId] = useState(
        firstConversation.id
    );

    const activeConversation = useMemo(() => {
        return (
            conversations.find(
                (conversation) =>
                    conversation.id === activeConversationId
            ) || conversations[0]
        );
    }, [conversations, activeConversationId]);

    // Create a new conversation
    const createConversation = () => {
        const conversation = createConversationObject();

        setConversations((prev) => [...prev, conversation]);
        setActiveConversationId(conversation.id);

        return conversation.id;
    };

    // Switch active conversation
    const switchConversation = (conversationId) => {
        setActiveConversationId(conversationId);
    };

    // Generic updater
    const updateConversation = (conversationId, updater) => {
        setConversations((prevConversations) =>
            prevConversations.map((conversation) => {
                if (conversation.id !== conversationId) {
                    return conversation;
                }

                return updater(conversation);
            })
        );
    };

    // Delete conversation
    const deleteConversation = (conversationId) => {
        if (conversations.length === 1) return;

        const remaining = conversations.filter(
            (conversation) => conversation.id !== conversationId
        );

        setConversations(remaining);

        if (activeConversationId === conversationId) {
            setActiveConversationId(remaining[0].id);
        }
    };

    // Manual rename
    const renameConversation = (conversationId, title) => {
        updateConversation(conversationId, (conversation) => ({
            ...conversation,
            title,
            updatedAt: new Date().toISOString(),
        }));
    };

    // Auto rename after first question
    const autoRenameConversation = (
        conversationId,
        firstQuestion
    ) => {
        const title = firstQuestion
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 40);

        updateConversation(conversationId, (conversation) => {
            // Only rename if it still has the default title
            if (conversation.title !== "New Chat") {
                return conversation;
            }

            return {
                ...conversation,
                title:
                    title.length === 40
                        ? `${title}...`
                        : title,
                updatedAt: new Date().toISOString(),
            };
        });
    };

    const value = {
        conversations,
        activeConversation,
        activeConversationId,

        createConversation,
        switchConversation,
        updateConversation,
        deleteConversation,
        renameConversation,
        autoRenameConversation,

        setConversations,
        setActiveConversationId,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error(
            "useChat must be used inside ChatProvider"
        );
    }

    return context;
}