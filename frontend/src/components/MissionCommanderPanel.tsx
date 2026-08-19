"use client";

import { useState } from "react";
import { askMission } from "@/lib/api";

const SUGGESTED = [
  "Which system is most at risk right now?",
  "Battery and vibration are both flagged — could they be related?",
  "What action should I take first based on the current anomalies?",
  "Is the current temperature reading within a safe range?",
];

interface Props {
  missionId: number;
}

export default function MissionCommanderPanel({ missionId }: Props) {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setAsked(trimmed);

    try {
      const result = await askMission({ mission_id: missionId, question: trimmed });
      setAnswer(result.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mission Commander is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleAsk(question);
  }

  function handleSuggestion(q: string) {
    setQuestion(q);
    handleAsk(q);
  }

  return (
    <section className="card flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="panel-head flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25ZM4.53 8.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l2-2a.75.75 0 0 0-1.06-1.06L6.5 9.19V6.75a.75.75 0 0 0-1.5 0v2.44L4.53 8.22ZM9.75 10.25a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4Z" clipRule="evenodd" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Mission Commander
            </h2>
            <p className="t-meta truncate">IBM Granite · Grounded in live mission data</p>
          </div>
        </div>
        {loading && (
          <span
            className="animate-pulse text-[11px] font-semibold"
            style={{ color: "var(--accent-text)" }}
          >
            Thinking…
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-3.5 px-5 py-4">
        <p className="t-body-muted">
          Ask IBM Granite a question grounded in the latest telemetry and anomalies.
        </p>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSuggestion(q)}
              disabled={loading}
              className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                border: "1px solid var(--accent-line)",
                background: "var(--accent-bg)",
                color: "var(--accent-text)",
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="commander-question" className="sr-only">
            Ask Mission Commander a question
          </label>
          <input
            id="commander-question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about mission status, anomalies, or recommended actions…"
            disabled={loading}
            className="flex-1 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="shrink-0 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            Ask
          </button>
        </form>

        {error && (
          <div
            className="t-body rounded-lg px-3.5 py-3"
            style={{
              border: "1px solid var(--danger-line)",
              background: "var(--danger-bg)",
              color: "var(--danger-fg)",
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-2.5" aria-hidden="true">
            {[66, 100, 83].map((w, i) => (
              <div key={i} className="skeleton" style={{ width: `${w}%`, height: 12 }} />
            ))}
          </div>
        )}

        {answer && !loading && (
          <div
            className="rounded-lg px-4 py-3.5"
            style={{
              border: "1px solid var(--accent-line)",
              background: "var(--accent-bg)",
            }}
          >
            {asked && (
              <p className="t-meta mb-2 italic">“{asked}”</p>
            )}
            <p className="section-label mb-1.5" style={{ color: "var(--accent-text)" }}>
              Response
            </p>
            <p className="t-body">{answer}</p>
          </div>
        )}
      </div>
    </section>
  );
}
