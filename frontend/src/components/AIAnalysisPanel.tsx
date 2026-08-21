"use client";

import { useRef, useState } from "react";
import { analyzeTelemetry } from "@/lib/api";
import type { AIAnalysis } from "@/lib/types";
import { severityTone, solidVar } from "@/lib/tone";
import StatusChip from "./ui/StatusChip";
import Meter from "./ui/Meter";

/** How full the risk meter reads for each level. */
const RISK_FILL: Record<string, number> = { low: 30, medium: 60, high: 100, critical: 100 };

interface Props {
  missionId: number;
}

export default function AIAnalysisPanel({ missionId }: Props) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // `disabled={loading}` only takes effect after a re-render, so two fast
  // clicks can both enter the handler. This ref closes that window.
  const inFlight = useRef(false);

  async function handleAnalyze() {
    if (inFlight.current) return;
    inFlight.current = true;

    setLoading(true);
    setError(null);
    try {
      setAnalysis(await analyzeTelemetry({ mission_id: missionId }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate AI analysis.");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  const riskKey = analysis?.risk_level.toLowerCase() ?? "low";
  const riskTone = riskKey === "low" ? "ok" : severityTone(riskKey);

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
              <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              AI Mission Analysis
            </h2>
            <p className="t-meta truncate">IBM watsonx · ibm/granite-4-h-small</p>
          </div>
        </div>
        <StatusChip tone="accent" className="hidden sm:inline-flex">
          watsonx
        </StatusChip>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <p className="t-body-muted">
          Analyze the latest telemetry using IBM watsonx Granite AI.
        </p>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full rounded-lg py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          {loading ? "Analyzing…" : analysis ? "Re-run Analysis" : "Analyze Mission"}
        </button>

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
            {[66, 100, 83, 75].map((w, i) => (
              <div key={i} className="skeleton" style={{ width: `${w}%`, height: 12 }} />
            ))}
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-4">
            {/* Risk level */}
            <div className="flex items-center gap-3">
              <StatusChip tone={riskTone}>{analysis.risk_level} risk</StatusChip>
              <div className="flex-1">
                <Meter
                  percent={RISK_FILL[riskKey] ?? 30}
                  tone={riskTone}
                  size={4}
                  label={`Risk level: ${analysis.risk_level}`}
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <p className="section-label mb-1.5">Health Summary</p>
              <p className="t-body">{analysis.health_summary}</p>
            </div>

            {/* Findings */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className="rounded-lg p-3.5"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <p className="section-label mb-2">Detected Anomalies</p>
                {analysis.anomalies.length === 0 ? (
                  <p className="t-body-muted">None detected.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {analysis.anomalies.map((a, i) => (
                      <li key={i} className="t-body flex items-start gap-2">
                        <span
                          className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: solidVar("high") }}
                        />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div
                className="rounded-lg p-3.5"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <p className="section-label mb-2">Recommended Actions</p>
                {analysis.recommendations.length === 0 ? (
                  <p className="t-body-muted">No actions required.</p>
                ) : (
                  <ol className="space-y-1.5">
                    {analysis.recommendations.map((r, i) => (
                      <li key={i} className="t-body flex items-start gap-2">
                        <span
                          className="t-num shrink-0 text-[11px] font-bold leading-[1.6]"
                          style={{ color: "var(--accent-text)" }}
                        >
                          {i + 1}.
                        </span>
                        {r}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
