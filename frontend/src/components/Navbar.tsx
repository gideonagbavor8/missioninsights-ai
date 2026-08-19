import type { Mission } from "@/lib/types";
import { missionTone } from "@/lib/tone";
import StatusChip from "./ui/StatusChip";
import ThemeToggle from "./ThemeToggle";

interface Props {
  mission?: Mission | null;
  lastTelemetryAt?: string | null;
}

export default function Navbar({ mission, lastTelemetryAt }: Props) {
  const lastUpdated = lastTelemetryAt
    ? new Date(lastTelemetryAt).toLocaleString([], {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--bg-base) 82%, transparent)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* ── Brand ── */}
        <div className="flex shrink-0 items-center gap-2.5">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2ZM4.332 7.053a6.5 6.5 0 0 1 10.642-1.92c-1.18.2-2.983.643-4.382 1.594C9.167 7.63 8.17 8.806 7.59 10.492c-.21.614-.327 1.228-.38 1.8a6.476 6.476 0 0 1-2.878-5.239Zm2.11 7.311a6.473 6.473 0 0 1-1.354-2.051c.234.023.49.035.762.035 1.201 0 2.57-.292 3.682-1.04 1.108-.745 1.862-1.842 2.234-3.093.16-.538.234-1.07.253-1.573a6.477 6.477 0 0 1 2.494 4.35c-.878-.4-1.98-.682-3.263-.682-1.72 0-3.36.538-4.808 1.054Z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="text-[15px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Mission<span style={{ color: "var(--accent-text)" }}>Insights</span> AI
          </span>
        </div>

        {/* ── Mission crumb ── */}
        {mission && (
          <div className="hidden min-w-0 flex-1 items-center gap-2.5 md:flex">
            <span
              className="h-5 w-px shrink-0"
              style={{ background: "var(--border)" }}
              aria-hidden="true"
            />
            <span
              className="truncate text-[13px] font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {mission.mission_name}
            </span>
            <span className="t-meta shrink-0">{mission.spacecraft_name}</span>
            <StatusChip tone={missionTone(mission.status)} dot>
              {mission.status}
            </StatusChip>
          </div>
        )}

        {/* ── Right rail ── */}
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          {lastUpdated && (
            <span className="t-meta t-num hidden lg:inline">
              Updated {lastUpdated}
            </span>
          )}
          <span
            className="hidden items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium sm:inline-flex"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            Powered by{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              IBM watsonx
            </span>
          </span>
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
