"use client";

import { useState } from "react";
import { analyzeTelemetry } from "@/lib/api";
import type { AIAnalysis } from "@/lib/types";

interface Props {
  missionId: number;
}

export default function AIAnalysisPanel({ missionId }: Props) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeTelemetry({ mission_id: missionId });

      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate AI analysis.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            AI Mission Analysis
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Analyze the latest telemetry using IBM watsonx AI.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Mission"}
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {analysis && (
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Mission Health Summary
            </p>

            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {analysis.health_summary}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Risk Level
            </p>

            <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
              {analysis.risk_level}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Detected Anomalies
            </p>

            {analysis.anomalies.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                No significant anomalies detected.
              </p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                {analysis.anomalies.map((anomaly, index) => (
                  <li key={index}>{anomaly}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Recommended Actions
            </p>

            {analysis.recommendations.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                No additional recommendations at this time.
              </p>
            ) : (
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </section>
  );
}