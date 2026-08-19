import type { Tone } from "@/lib/tone";
import { solidVar } from "@/lib/tone";

interface Props {
  /** 0–100. Clamped. */
  percent: number;
  tone: Tone;
  /** Track thickness in px. */
  size?: number;
  /** Accessible description; omit only when an adjacent label already reads it out. */
  label?: string;
}

/**
 * Horizontal progress track. Replaces the three near-identical bar
 * implementations that lived in TelemetryGauge, MissionHealthScore and
 * AIAnalysisPanel — each with its own hardcoded track colour.
 */
export default function Meter({ percent, tone, size = 6, label }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height: size, background: "var(--track)" }}
      role="meter"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%`, background: solidVar(tone) }}
      />
    </div>
  );
}
