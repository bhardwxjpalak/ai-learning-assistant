import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Chat from "./pages/Chat";
import KnowledgeBase from "./pages/KnowledgeBase";
import Layout from "./components/Layout";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
          <Layout>
            <Home />
          </Layout>}
        />

        <Route
          path="/upload"
          element={
          <Layout>
            <Upload />
          </Layout>}
        />

        <Route
          path="/chat"
          element={
          <Layout>
            <Chat />
          </Layout>}
        />

        <Route
          path="/knowledge-base"
          element={
          <Layout>
            <KnowledgeBase />
          </Layout>}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;