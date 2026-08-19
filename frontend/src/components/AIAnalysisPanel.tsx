"use client";

import { useState } from "react";
import { analyzeTelemetry } from "@/lib/api";
import type { AIAnalysis } from "@/lib/types";

const RISK_CFG: Record<string, { bar: string; text: string; bg: string; width: string }> = {
  low:    { bar: "#22c55e", text: "#4ade80", bg: "rgba(34,197,94,0.12)",  width: "30%"  },
  medium: { bar: "#f59e0b", text: "#fbbf24", bg: "rgba(245,158,11,0.12)", width: "60%"  },
  high:   { bar: "#ef4444", text: "#f87171", bg: "rgba(239,68,68,0.12)",  width: "100%" },
};

function getRisk(r: string) { return RISK_CFG[r.toLowerCase()] ?? RISK_CFG.low; }

interface Props { missionId: number; }

export default function AIAnalysisPanel({ missionId }: Props) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      setAnalysis(await analyzeTelemetry({ mission_id: missionId }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate AI analysis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="card flex flex-col overflow-hidden shadow-sm"
    >
      {/* ── Header — indigo accent band ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(79,70,229,0.08) 100%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
            </svg>
          </span>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>AI Mission Analysis</h2>
            <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>IBM watsonx · ibm/granite-4-h-small</p>
          </div>
        </div>
        <span
          className="rounded border px-2 py-0.5 text-[10px] font-bold tracking-wide"
          style={{
            borderColor: "rgba(99,102,241,0.4)",
            background: "rgba(99,102,241,0.15)",
            color: "#a5b4fc",
          }}
        >
          IBM watsonx AI
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col px-5 py-4 space-y-4">
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Analyze the latest telemetry using IBM watsonx Granite AI.
        </p>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full rounded-lg py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          {loading ? "Analyzing…" : "Analyze Mission"}
        </button>

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
            {[0.66, 1, 0.83, 0.75].map((w, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded"
                style={{ width: `${w * 100}%`, background: "rgba(255,255,255,0.07)" }}
              />
            ))}
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-4">
            {/* Risk level */}
            {(() => {
              const r = getRisk(analysis.risk_level);
              return (
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold capitalize"
                    style={{ background: r.bg, color: r.text }}
                  >
                    {analysis.risk_level} risk
                  </span>
                  <div
                    className="flex-1 h-1 overflow-hidden rounded-full"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: r.width, background: r.bar }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Summary */}
            <div>
              <p className="section-label mb-1">Health Summary</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {analysis.health_summary}
              </p>
            </div>

            {/* 2-col: anomalies + recommendations */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className="rounded-lg p-3"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <p className="section-label mb-2">Detected Anomalies</p>
                {analysis.anomalies.length === 0
                  ? <p className="text-xs" style={{ color: "var(--text-secondary)" }}>None detected.</p>
                  : <ul className="space-y-1">
                      {analysis.anomalies.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "var(--text-primary)" }}>
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange-400" />{a}
                        </li>
                      ))}
                    </ul>
                }
              </div>
              <div
                className="rounded-lg p-3"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <p className="section-label mb-2">Recommended Actions</p>
                {analysis.recommendations.length === 0
                  ? <p className="text-xs" style={{ color: "var(--text-secondary)" }}>No actions required.</p>
                  : <ol className="space-y-1">
                      {analysis.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: "var(--text-primary)" }}>
                          <span className="shrink-0 text-[10px] font-bold tabular-nums" style={{ color: "var(--accent)" }}>{i + 1}.</span>{r}
                        </li>
                      ))}
                    </ol>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
