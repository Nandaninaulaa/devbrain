import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";

const WIDTH = 820;
const HEIGHT = 480;

// Minimal force-directed layout (no d3 dependency) — good enough for a
// few hundred nodes. Runs a fixed number of simulation steps up front,
// then just renders the settled positions.
function layoutGraph(nodes, edges) {
  const positioned = nodes.map((n) => ({
    ...n,
    x: WIDTH / 2 + (Math.random() - 0.5) * 200,
    y: HEIGHT / 2 + (Math.random() - 0.5) * 200,
    vx: 0,
    vy: 0,
  }));
  const byId = Object.fromEntries(positioned.map((n) => [n.id, n]));

  const REPULSION = 1800;
  const SPRING = 0.02;
  const SPRING_LEN = 90;
  const DAMPING = 0.85;
  const STEPS = 220;

  for (let step = 0; step < STEPS; step++) {
    // Repulsion between all node pairs.
    for (let i = 0; i < positioned.length; i++) {
      for (let j = i + 1; j < positioned.length; j++) {
        const a = positioned[i];
        const b = positioned[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist2 = dx * dx + dy * dy || 0.01;
        const force = REPULSION / dist2;
        const dist = Math.sqrt(dist2);
        dx /= dist;
        dy /= dist;
        a.vx += dx * force;
        a.vy += dy * force;
        b.vx -= dx * force;
        b.vy -= dy * force;
      }
    }
    // Spring attraction along edges.
    for (const e of edges) {
      const a = byId[e.source];
      const b = byId[e.target];
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const force = (dist - SPRING_LEN) * SPRING;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }
    // Integrate + damp + keep on-canvas.
    for (const n of positioned) {
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx;
      n.y += n.vy;
      n.x = Math.min(WIDTH - 20, Math.max(20, n.x));
      n.y = Math.min(HEIGHT - 20, Math.max(20, n.y));
    }
  }

  return positioned;
}

export default function GraphPanel() {
  const [graph, setGraph] = useState(null);
  const [positioned, setPositioned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState(null);
  const loadedOnce = useRef(false);

  async function loadGraph() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGraph(300);
      setGraph(data);
      setPositioned(layoutGraph(data.nodes, data.edges));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuild() {
    setBuilding(true);
    setError(null);
    try {
      await api.buildGraph(200);
      await loadGraph();
    } catch (err) {
      setError(err.message);
    } finally {
      setBuilding(false);
    }
  }

  async function handleClear() {
    setError(null);
    try {
      await api.clearGraph();
      setGraph(null);
      setPositioned([]);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (!loadedOnce.current) {
      loadedOnce.current = true;
      loadGraph();
    }
  }, []);

  const byId = Object.fromEntries(positioned.map((n) => [n.id, n]));

  return (
    <div>
      <p className="panel-note">
        Extracts concepts from indexed chunks and links them to the files
        they appear in. Requires Neo4j running (see docker-compose). Uses an
        LLM if configured, otherwise falls back to function/class names.
      </p>

      <div className="graph-toolbar">
        <button className="primary" onClick={handleBuild} disabled={building}>
          {building ? "Building…" : "Build graph"}
        </button>
        <button onClick={loadGraph} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
        <button onClick={handleClear}>Clear graph</button>
      </div>

      {error && <div className="error">{error}</div>}

      {graph && graph.nodes.length === 0 && (
        <div className="empty">
          No graph data yet — ingest some content, then build the graph.
        </div>
      )}

      {positioned.length > 0 && (
        <div className="graph-frame">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            {graph.edges.map((e, i) => {
              const a = byId[e.source];
              const b = byId[e.target];
              if (!a || !b) return null;
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#3a3324"
                  strokeWidth={1}
                />
              );
            })}
            {positioned.map((n) => (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={n.type === "file" ? 8 : 6}
                  fill={n.type === "file" ? "#4c8aa3" : "#e0a545"}
                  stroke="#15120d"
                  strokeWidth={1.5}
                />
                <text
                  x={0}
                  y={-12}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                  fill="#e8ddc2"
                >
                  {n.label.length > 22 ? n.label.slice(0, 20) + "…" : n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {graph && graph.nodes.length > 0 && (
        <div className="graph-legend">
          <span>
            <span className="dot" style={{ background: "#e0a545" }} />
            {graph.nodes.filter((n) => n.type === "concept").length} concepts
          </span>
          <span>
            <span className="dot" style={{ background: "#4c8aa3" }} />
            {graph.nodes.filter((n) => n.type === "file").length} files
          </span>
          <span>{graph.edges.length} links</span>
        </div>
      )}
    </div>
  );
}
