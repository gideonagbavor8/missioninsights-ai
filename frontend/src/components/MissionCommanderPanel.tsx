"use client";

import { useState } from "react";
import { askMission } from "@/lib/api";

const SUGGESTED = [
  "Which system is most at risk right now?",
  "Battery and vibration are both flagged — could they be related?",
  "What action should I take first based on the current anomalies?",
  "Is the current temperature reading within a safe range?",
];

interface Props { missionId: number; }

export default function MissionCommanderPanel({ missionId }: Props) {
  const [question, setQuestion] = useState("");
  const [answer,   setAnswer]   = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleAsk(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const result = await askMission({ mission_id: missionId, question: trimmed });
      setAnswer(result.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mission Commander is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); handleAsk(question); }
  function handleSuggestion(q: string) { setQuestion(q); handleAsk(q); }

  return (
    <section className="card flex flex-col overflow-hidden shadow-sm">
      {/* ── Header — indigo gradient band ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "linear-gradient(135deg, rgba(79,70,229,0.20) 0%, rgba(99,102,241,0.08) 100%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25ZM4.53 8.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l2-2a.75.75 0 0 0-1.06-1.06L6.5 9.19V6.75a.75.75 0 0 0-1.5 0v2.44L4.53 8.22ZM9.75 10.25a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4Z" clipRule="evenodd" />
            </svg>
          </span>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Mission Commander</h2>
            <p className="text-[10px]" style={{ color: "#a5b4fc" }}>IBM Granite · Grounded in live mission data</p>
          </div>
        </div>
        {loading && (
          <span className="animate-pulse text-xs font-medium" style={{ color: "#a5b4fc" }}>Thinking…</span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Ask IBM Granite a question grounded in the latest telemetry and anomalies.
        </p>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSuggestion(q)}
              disabled={loading}
              className="rounded-full px-2.5 py-1 text-[10px] font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                border: "1px solid rgba(99,102,241,0.35)",
                background: "rgba(99,102,241,0.10)",
                color: "#a5b4fc",
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about mission status, anomalies, or recommended actions…"
            disabled={loading}
            className="flex-1 rounded-lg px-3.5 py-2 text-xs placeholder-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            Ask
          </button>
        </form>

        {error && (
          <div
            className="rounded-lg p-3 text-xs"
            style={{
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-2">
            {[0.66, 1, 0.83].map((w, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded"
                style={{ width: `${w * 100}%`, background: "rgba(255,255,255,0.07)" }}
              />
            ))}
          </div>
        )}

        {answer && !loading && (
          <div
            className="rounded-lg px-4 py-3"
            style={{
              border: "1px solid rgba(99,102,241,0.25)",
              background: "rgba(99,102,241,0.08)",
            }}
          >
            <p className="section-label mb-1.5" style={{ color: "#a5b4fc" }}>Response</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>{answer}</p>
          </div>
        )}
      </div>
    </section>
  );
}
