import { useState } from "react";
import { api } from "../api.js";

export default function IngestPanel({ onIngested, stats }) {
  const [folder, setFolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleIngest(e) {
    e.preventDefault();
    if (!folder.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.ingest(folder.trim());
      setResult(res);
      onIngested?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="panel-note">
        Point this at a local project folder — code, .md, .pdf. It walks the
        folder, chunks the content by function/class or paragraph, and
        indexes it for search.
      </p>

      <form className="ingest-row" onSubmit={handleIngest}>
        <input
          placeholder="/path/to/your/project"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        />
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Indexing…" : "Ingest folder"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="card">
          <div className="card-tag">
            <span className="call-number">INDEXED</span>
            <span className="call-label">{result.seconds}s</span>
          </div>
          <div className="card-body">
            {result.files_ingested} files → {result.chunks_stored} chunks stored.
            {result.files_skipped_empty > 0 &&
              ` (${result.files_skipped_empty} empty files skipped.)`}
          </div>
        </div>
      )}

      {stats && (
        <div className="stats-line">
          Collection "{stats.collection}" currently holds {stats.count} chunks.
        </div>
      )}
    </div>
  );
}
