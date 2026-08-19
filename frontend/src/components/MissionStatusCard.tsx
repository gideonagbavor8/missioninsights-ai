import type { Mission } from "@/lib/types";

const STATUS: Record<string, { dot: string; text: string; bg: string }> = {
  active:    { dot: "bg-emerald-500", text: "#4ade80", bg: "rgba(34,197,94,0.12)"  },
  nominal:   { dot: "bg-emerald-500", text: "#4ade80", bg: "rgba(34,197,94,0.12)"  },
  warning:   { dot: "bg-amber-400",   text: "#fbbf24", bg: "rgba(245,158,11,0.12)" },
  critical:  { dot: "bg-red-500",     text: "#f87171", bg: "rgba(239,68,68,0.12)"  },
  inactive:  { dot: "bg-slate-400",   text: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
  completed: { dot: "bg-blue-500",    text: "#60a5fa", bg: "rgba(59,130,246,0.12)"  },
};

function getS(s: string) { return STATUS[s.toLowerCase()] ?? STATUS.inactive; }

interface Props { mission: Mission; }

export default function MissionStatusCard({ mission }: Props) {
  const s = getS(mission.status);
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="section-label">Mission</p>
          <h2
            className="mt-1 truncate text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {mission.mission_name}
          </h2>
          <p className="mt-0.5 truncate text-sm" style={{ color: "var(--text-secondary)" }}>
            Spacecraft:{" "}
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {mission.spacecraft_name}
            </span>
          </p>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
          style={{ background: s.bg, color: s.text }}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {mission.status}
        </span>
      </div>
    </div>
  );
}
