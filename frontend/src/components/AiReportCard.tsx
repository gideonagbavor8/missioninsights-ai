import type { AIReport } from "@/lib/types";

const RISK_STYLES: Record<string, { accent: string; badge: string }> = {
  critical: {
    accent: "border-l-red-500",
    badge:  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  high: {
    accent: "border-l-orange-500",
    badge:  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  },
  medium: {
    accent: "border-l-yellow-400",
    badge:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  low: {
    accent: "border-l-green-500",
    badge:  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  },
};

function getStyle(riskLevel: string) {
  return RISK_STYLES[riskLevel.toLowerCase()] ?? RISK_STYLES.low;
}

interface Props {
  report: AIReport;
}

export default function AiReportCard({ report }: Props) {
  const style = getStyle(report.risk_level);
  const createdAt = report.created_at
    ? new Date(report.created_at).toLocaleString()
    : null;

  return (
    <div
      className={`rounded-xl border border-zinc-200 border-l-4 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 ${style.accent}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          AI Report #{report.id}
        </p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${style.badge}`}
        >
          {report.risk_level} risk
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {report.summary}
      </p>
      <div className="mt-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Recommendation
        </p>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
          {report.recommendation}
        </p>
      </div>
      {createdAt && (
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
          Generated: {createdAt}
        </p>
      )}
    </div>
  );
}
