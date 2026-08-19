import type { AIReport } from "@/lib/types";
import { severityTone, solidVar } from "@/lib/tone";
import StatusChip from "./ui/StatusChip";

interface Props {
  report: AIReport;
  /** The newest report opens by default; the rest start collapsed. */
  defaultOpen?: boolean;
}

/**
 * A report as a collapsed disclosure row.
 *
 * Previously each report rendered its full summary and recommendation, so the
 * section grew without bound — twenty reports meant a wall of prose. Collapsed
 * rows keep every report reachable at a fixed cost per item, and <details>
 * means expanding needs no client JS.
 */
export default function AiReportCard({ report, defaultOpen = false }: Props) {
  // `low` risk is a good outcome on a report, unlike a `low` severity anomaly.
  const tone = report.risk_level.toLowerCase() === "low" ? "ok" : severityTone(report.risk_level);

  const createdAt = report.created_at
    ? new Date(report.created_at).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <details
      className="disclosure card card-flat card-interactive overflow-hidden"
      style={{ borderLeft: `3px solid ${solidVar(tone)}` }}
      open={defaultOpen}
    >
      <summary className="flex items-start gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip tone={tone}>{report.risk_level} risk</StatusChip>
            <span className="t-meta t-num">Report #{report.id}</span>
            {createdAt && (
              <>
                <span className="t-meta" aria-hidden="true">·</span>
                <span className="t-meta t-num">{createdAt}</span>
              </>
            )}
          </div>

          {/* Teaser, hidden once expanded so the summary is never duplicated */}
          <p className="disclosure-teaser t-body-muted mt-1.5 line-clamp-1">
            {report.summary}
          </p>
        </div>

        <span
          className="disclosure-chevron mt-1 shrink-0"
          style={{ color: "var(--text-muted)" }}
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </span>
      </summary>

      <div className="px-4 pb-4">
        <p className="t-body">{report.summary}</p>

        <div
          className="mt-3 rounded-lg px-3.5 py-3"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <p className="section-label mb-1.5">Recommendation</p>
          <p className="t-body">{report.recommendation}</p>
        </div>
      </div>
    </details>
  );
}
