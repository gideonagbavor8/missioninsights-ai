import type { Mission } from "@/lib/types";
import { missionTone } from "@/lib/tone";
import StatusChip from "./ui/StatusChip";

interface Props {
  mission: Mission;
}

export default function MissionStatusCard({ mission }: Props) {
  const tone = missionTone(mission.status);

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="section-label">Mission</p>
          <h3
            className="mt-1.5 truncate text-base font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {mission.mission_name}
          </h3>
          <p className="t-body-muted mt-1 truncate">
            Spacecraft{" "}
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>
              {mission.spacecraft_name}
            </span>
          </p>
        </div>
        <StatusChip tone={tone} dot>
          {mission.status}
        </StatusChip>
      </div>
    </div>
  );
}
