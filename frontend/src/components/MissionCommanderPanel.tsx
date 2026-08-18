"use client";

import { useState } from "react";
import { askMission } from "@/lib/api";

const SUGGESTED_QUESTIONS = [
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
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(
        err instanceof Error ? err.message : "Mission Commander is unavailable.",
      );
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
    <section className="rounded-xl border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
            {/* satellite dish icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M9.04 4.372a.75.75 0 0 1 1.06-.04l.928.836A5.501 5.501 0 0 1 15.5 10a5.5 5.5 0 0 1-5.5 5.5 5.501 5.501 0 0 1-4.832-2.864l-.836-.928a.75.75 0 0 1 1.101-1.02l.596.663A4 4 0 1 0 10 6a3.996 3.996 0 0 0-2.36.761l-.663-.596a.75.75 0 0 1 .04-1.06l.027-.025ZM7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-4.5 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 2.5 10Zm13.25-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5ZM10 2.5a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 2.5Z" />
            </svg>
          </span>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Mission Commander
          </h2>
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ask IBM Granite a question about this mission. Answers are grounded
          in the latest telemetry and detected anomalies only.
        </p>
      </div>

      {/* Suggested questions */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSuggestion(q)}
            disabled={loading}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/70"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about mission status, anomalies, or recommended actions…"
          disabled={loading}
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Asking…" : "Ask"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-4 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-700" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-700" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-100 dark:bg-zinc-700" />
        </div>
      )}

      {/* Answer */}
      {answer && !loading && (
        <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-400 dark:text-indigo-500">
            Mission Commander
          </p>
          <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {answer}
          </p>
        </div>
      )}
    </section>
  );
}
