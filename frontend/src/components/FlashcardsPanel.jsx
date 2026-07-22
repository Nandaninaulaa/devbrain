import { useState } from "react";
import { api } from "../api.js";

export default function FlashcardsPanel() {
  const [cards, setCards] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadCards() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.flashcards(5);
      setCards(res.flashcards || []);
      setRevealed({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggle(i) {
    setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div>
      <p className="panel-note">
        Click a card to flip it. Cards are drafted from whatever you've indexed so far.
      </p>

      <button className="primary" onClick={loadCards} disabled={loading}>
        {loading ? "Drafting…" : "Draft 5 flashcards"}
      </button>

      {error && <div className="error" style={{ marginTop: 14 }}>{error}</div>}

      <div className="flashcard-grid" style={{ marginTop: 18 }}>
        {cards.length === 0 && !loading && (
          <div className="empty">
            No flashcards yet — index some content, then draft a batch.
          </div>
        )}
        {cards.map((c, i) => (
          <div
            key={i}
            className={`flashcard ${revealed[i] ? "revealed" : ""}`}
            onClick={() => toggle(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle(i)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-face front">
                <div className="eyebrow">Card {String(i + 1).padStart(2, "0")} · question</div>
                <div className="content">{c.question}</div>
                <div className="flashcard-hint">click to flip</div>
              </div>
              <div className="flashcard-face back">
                <div className="eyebrow">Answer</div>
                <div className="content">{c.answer}</div>
                <div className="flashcard-hint">click to flip back</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
