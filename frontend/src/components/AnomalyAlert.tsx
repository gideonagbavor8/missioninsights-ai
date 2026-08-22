import type { Anomaly } from "@/lib/types";
import { severityTone, solidVar, fgVar } from "@/lib/tone";
import StatusChip from "./ui/StatusChip";

interface Props {
  anomaly: Anomaly;
}

export default function AnomalyAlert({ anomaly }: Props) {
  const tone = severityTone(anomaly.severity);
  const detectedAt = anomaly.detected_at
    ? new Date(anomaly.detected_at).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // `card-flat` because these sit nested inside an already-elevated card.
  return (
    <article className="card card-flat card-interactive flex overflow-hidden">
      {/* Severity stripe */}
      <div className="w-1 shrink-0" style={{ background: solidVar(tone) }} aria-hidden="true" />

      <div className="min-w-0 flex-1 px-3.5 py-3">
        {/* Severity · confidence */}
        <div className="flex items-center justify-between gap-2">
          <StatusChip tone={tone}>{anomaly.severity}</StatusChip>
          <span
            className="t-num text-[11px] font-semibold"
            style={{ color: fgVar(tone) }}
            title="Detection confidence"
          >
            {/* Supports both legacy 0–1 values and current 0–100 values. */}
            {(anomaly.confidence <= 1
              ? anomaly.confidence * 100
              : anomaly.confidence
            ).toFixed(0)}% confidence
          </span>
        </div>

        {/* Issue */}
        <h3
          className="mt-2 text-[13px] font-semibold leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {anomaly.issue}
        </h3>

        {/* Recommended action */}
        <p className="t-body-muted mt-1">
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            Action:{" "}
          </span>
          {anomaly.recommended_action}
        </p>

        {detectedAt && (
          <p className="t-meta t-num mt-2">Detected {detectedAt}</p>
        )}
      </div>
    </article>
  );
}
