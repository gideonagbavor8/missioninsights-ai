import Link from "next/link";

import type { Mission } from "@/lib/types";
import { missionTone } from "@/lib/tone";
import Logo from "./brand/Logo";
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
        <Link
          href="/dashboard"
          aria-label="MissionInsights AI — go to dashboard"
          className="shrink-0 rounded-md"
        >
          {/* Mark only below sm, where the crumb needs the horizontal room */}
          <Logo variant="icon" size={28} className="sm:hidden" />
          <Logo variant="full" size={28} className="hidden sm:inline-flex" />
        </Link>

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
