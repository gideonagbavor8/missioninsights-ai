import type { Mission } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

const STATUS_DOT: Record<string, string> = {
  active:    "bg-emerald-500",
  nominal:   "bg-emerald-500",
  warning:   "bg-amber-400",
  critical:  "bg-red-500",
  inactive:  "bg-slate-400",
  completed: "bg-blue-400",
};

const STATUS_PILL: Record<string, string> = {
  active:    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  nominal:   "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  warning:   "border-amber-400/30 bg-amber-400/10 text-amber-400",
  critical:  "border-red-500/30 bg-red-500/10 text-red-400",
  inactive:  "border-slate-500/30 bg-slate-500/10 text-slate-400",
  completed: "border-blue-400/30 bg-blue-400/10 text-blue-400",
};

interface Props {
  mission?: Mission | null;
  lastTelemetryAt?: string | null;
}

export default function Navbar({ mission, lastTelemetryAt }: Props) {
  const dotClass  = STATUS_DOT[mission?.status?.toLowerCase() ?? ""]  ?? STATUS_DOT.inactive;
  const pillClass = STATUS_PILL[mission?.status?.toLowerCase() ?? ""] ?? STATUS_PILL.inactive;

  const lastUpdated = lastTelemetryAt
    ? new Date(lastTelemetryAt).toLocaleString([], {
        day: "2-digit", month: "short",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--bg-base) 88%, transparent)",
      }}
    >
      <div className="mx-auto flex h-11 max-w-screen-xl items-center gap-4 px-5 lg:px-8">

        {/* ── Brand ── */}
        <div className="flex shrink-0 items-center gap-2.5">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white"
            style={{ background: "var(--accent)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2ZM4.332 7.053a6.5 6.5 0 0 1 10.642-1.92c-1.18.2-2.983.643-4.382 1.594C9.167 7.63 8.17 8.806 7.59 10.492c-.21.614-.327 1.228-.38 1.8a6.476 6.476 0 0 1-2.878-5.239Zm2.11 7.311a6.473 6.473 0 0 1-1.354-2.051c.234.023.49.035.762.035 1.201 0 2.57-.292 3.682-1.04 1.108-.745 1.862-1.842 2.234-3.093.16-.538.234-1.07.253-1.573a6.477 6.477 0 0 1 2.494 4.35c-.878-.4-1.98-.682-3.263-.682-1.72 0-3.36.538-4.808 1.054Z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Mission<span style={{ color: "var(--accent)" }}>Insights</span> AI
          </span>
        </div>

        {/* ── Divider ── */}
        <span className="hidden h-4 w-px sm:block" style={{ background: "var(--border)" }} aria-hidden="true" />

        {/* ── Mission crumb ── */}
        {mission && (
          <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
            <span className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {mission.mission_name}
            </span>
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span className="shrink-0 text-xs" style={{ color: "var(--text-secondary)" }}>
              {mission.spacecraft_name}
            </span>
            {lastUpdated && (
              <>
                <span style={{ color: "var(--text-muted)" }}>·</span>
                <span className="shrink-0 text-xs" style={{ color: "var(--text-secondary)" }}>
                  Updated {lastUpdated}
                </span>
              </>
            )}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${pillClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
              {mission.status}
            </span>
          </div>
        )}

        {/* ── Right: watsonx badge + theme toggle ── */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span
            className="hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium sm:flex"
            style={{
              borderColor: "var(--border)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--text-secondary)",
            }}
          >
            Powered by{" "}
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>
              IBM watsonx
            </span>
          </span>
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
