import { useState } from "react";
import { api } from "../api.js";
import { callNumber, fileName } from "../callNumber.js";

export default function ChatPanel() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.ask(question.trim());
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="ask-form" onSubmit={handleAsk}>
        <input
          placeholder="e.g. how does the retry logic work in the payment service?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Searching…" : "Ask"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <>
          <div className="card">
            <div className="card-tag">
              <span className="call-number">ANSWER</span>
              <span className="call-label">{result.sources?.length || 0} sources</span>
            </div>
            <div className="card-body">{result.answer}</div>
          </div>

          {result.sources?.map((s, i) => (
            <div className="card" key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="card-tag">
                <span className="call-number">{callNumber(s.source_path)}</span>
                <span className="call-label">
                  {fileName(s.source_path)}
                  {s.symbol ? ` · ${s.symbol}` : ""}
                </span>
              </div>
              <div className="card-body mono">{s.text}</div>
            </div>
          ))}
        </>
      )}

      {!result && !loading && (
        <div className="empty">Ask a question about your indexed content to get started.</div>
      )}
    </div>
  );
}
