import { useEffect, useState } from "react";
import { api } from "./api.js";
import IngestPanel from "./components/IngestPanel.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import FlashcardsPanel from "./components/FlashcardsPanel.jsx";
import GraphPanel from "./components/GraphPanel.jsx";

const TABS = [
  { id: "ask", idx: "01", label: "Ask" },
  { id: "flashcards", idx: "02", label: "Flashcards" },
  { id: "graph", idx: "03", label: "Graph" },
  { id: "ingest", idx: "04", label: "Ingest" },
];

const TAB_META = {
  ask: {
    title: "Ask the catalog",
    sub: "Query your own code and notes in plain English.",
  },
  flashcards: {
    title: "Flashcard drawer",
    sub: "Auto-drafted study cards from what you've indexed.",
  },
  graph: {
    title: "Concept map",
    sub: "How ideas connect across your files.",
  },
  ingest: {
    title: "Add to the catalog",
    sub: "Point at a folder — it gets read, chunked, and indexed.",
  },
};

export default function App() {
  const [tab, setTab] = useState("ask");
  const [stats, setStats] = useState(null);

  async function refreshStats() {
    try {
      setStats(await api.stats());
    } catch {
      // backend not running yet — ignore, panels show their own errors
    }
  }

  useEffect(() => {
    refreshStats();
  }, []);

  const meta = TAB_META[tab];

  return (
    <div className="shell">
      <aside className="drawer">
        <div className="drawer-brand">
          <div className="mark">Developer Brain</div>
          <div className="sub">personal knowledge catalog</div>
        </div>
        <nav className="drawer-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`drawer-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="idx">{t.idx}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="drawer-footer">
          {stats ? (
            <>
              <span className="count">{stats.count}</span> cards indexed
            </>
          ) : (
            "backend not connected"
          )}
        </div>
      </aside>

      <main className="desk">
        <div className="desk-header">
          <h1>{meta.title}</h1>
          <p>{meta.sub}</p>
        </div>

        {tab === "ask" && <ChatPanel />}
        {tab === "flashcards" && <FlashcardsPanel />}
        {tab === "graph" && <GraphPanel />}
        {tab === "ingest" && (
          <IngestPanel stats={stats} onIngested={refreshStats} />
        )}
      </main>
    </div>
  );
}
