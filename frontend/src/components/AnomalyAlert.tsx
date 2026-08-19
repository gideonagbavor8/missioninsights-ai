import type { Anomaly } from "@/lib/types";

const SEV: Record<string, { stripe: string; badge: string; badgeText: string }> = {
  critical: { stripe: "#ef4444", badge: "rgba(239,68,68,0.12)",   badgeText: "#f87171" },
  high:     { stripe: "#f97316", badge: "rgba(249,115,22,0.12)",  badgeText: "#fb923c" },
  medium:   { stripe: "#f59e0b", badge: "rgba(245,158,11,0.12)",  badgeText: "#fbbf24" },
  low:      { stripe: "#3b82f6", badge: "rgba(59,130,246,0.12)",  badgeText: "#60a5fa" },
};

function getSev(s: string) { return SEV[s.toLowerCase()] ?? SEV.low; }

interface Props { anomaly: Anomaly; }

export default function AnomalyAlert({ anomaly }: Props) {
  const sev = getSev(anomaly.severity);
  const detectedAt = anomaly.detected_at
    ? new Date(anomaly.detected_at).toLocaleString([], {
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
      }}
    >
      {/* Left severity stripe */}
      <div className="w-1 shrink-0" style={{ background: sev.stripe }} />

      <div className="flex-1 min-w-0 px-3 py-2.5">
        {/* Row 1: badge · title · confidence */}
        <div className="flex items-center gap-2">
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
            style={{ background: sev.badge, color: sev.badgeText }}
          >
            {anomaly.severity}
          </span>
          <span
            className="flex-1 min-w-0 text-sm font-semibold leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            {anomaly.issue}
          </span>
          <span
            className="shrink-0 text-xs font-bold tabular-nums ml-2"
            style={{ color: sev.badgeText }}
          >
            {anomaly.confidence.toFixed(0)}%
          </span>
        </div>

        {/* Row 2: action · timestamp */}
        <div className="mt-0.5 flex items-baseline justify-between gap-3">
          <p className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>Action: </span>
            {anomaly.recommended_action}
          </p>
          {detectedAt && (
            <span className="shrink-0 text-[10px] tabular-nums whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
              {detectedAt}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
