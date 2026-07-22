import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Chat from "./pages/Chat";
import KnowledgeBase from "./pages/KnowledgeBase";
import Layout from "./components/Layout";

import { ChatProvider } from "./context/ChatContext";

function App() {
    return (
        <ChatProvider>
            <BrowserRouter>
                <Routes>

                    <Route
                        path="/"
                        element={
                            <Layout>
                                <Home />
                            </Layout>
                        }
                    />

                    <Route
                        path="/upload"
                        element={
                            <Layout>
                                <Upload />
                            </Layout>
                        }
                    />

                    <Route
                        path="/chat"
                        element={
                            <Layout>
                                <Chat />
                            </Layout>
                        }
                    />

                    <Route
                        path="/knowledge-base"
                        element={
                            <Layout>
                                <KnowledgeBase />
                            </Layout>
                        }
                    />

                </Routes>
            </BrowserRouter>
        </ChatProvider>
    );
}

export default App;