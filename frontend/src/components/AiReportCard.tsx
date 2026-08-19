import type { AIReport } from "@/lib/types";

const RISK: Record<string, { stripe: string; text: string; bg: string }> = {
  critical: { stripe: "#ef4444", text: "#f87171", bg: "rgba(239,68,68,0.12)"  },
  high:     { stripe: "#f97316", text: "#fb923c", bg: "rgba(249,115,22,0.12)" },
  medium:   { stripe: "#f59e0b", text: "#fbbf24", bg: "rgba(245,158,11,0.12)" },
  low:      { stripe: "#22c55e", text: "#4ade80", bg: "rgba(34,197,94,0.12)"  },
};

function getRisk(r: string) { return RISK[r.toLowerCase()] ?? RISK.low; }

interface Props { report: AIReport; }

export default function AiReportCard({ report }: Props) {
  const risk = getRisk(report.risk_level);
  const createdAt = report.created_at
    ? new Date(report.created_at).toLocaleString([], {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  return (
    <div
      className="flex overflow-hidden rounded-xl"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      {/* Left risk stripe */}
      <div className="w-1 shrink-0" style={{ background: risk.stripe }} />

      <div className="flex-1 px-4 py-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <p className="section-label">AI Report #{report.id}</p>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold capitalize"
              style={{ background: risk.bg, color: risk.text }}
            >
              {report.risk_level} risk
            </span>
            {createdAt && (
              <span className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                {createdAt}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {report.summary}
        </p>

        {/* Recommendation */}
        <div
          className="mt-2.5 rounded-lg px-3 py-2"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <p className="section-label mb-1">Recommendation</p>
          <p className="text-xs" style={{ color: "var(--text-primary)" }}>{report.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
