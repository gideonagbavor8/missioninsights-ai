import type { Anomaly } from "@/lib/types";

const SEVERITY_STYLES: Record<string, { bar: string; badge: string; row: string }> = {
  critical: {
    bar:   "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    row:   "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30",
  },
  high: {
    bar:   "bg-orange-500",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    row:   "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30",
  },
  medium: {
    bar:   "bg-yellow-400",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    row:   "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30",
  },
  low: {
    bar:   "bg-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    row:   "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
  },
};

function getStyle(severity: string) {
  return SEVERITY_STYLES[severity.toLowerCase()] ?? SEVERITY_STYLES.low;
}

interface Props {
  anomaly: Anomaly;
}

export default function AnomalyAlert({ anomaly }: Props) {
  const style = getStyle(anomaly.severity);
  const detectedAt = anomaly.detected_at
    ? new Date(anomaly.detected_at).toLocaleString()
    : null;

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${style.row}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${style.bar}`} />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {anomaly.issue}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${style.badge}`}
          >
            {anomaly.severity}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {anomaly.confidence.toFixed(0)}% confidence
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Recommended action:{" "}
        </span>
        {anomaly.recommended_action}
      </p>
      {detectedAt && (
        <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          Detected: {detectedAt}
        </p>
      )}
    </div>
  );
}
