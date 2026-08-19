import type { Tone } from "@/lib/tone";
import { fgVar } from "@/lib/tone";
import Meter from "./ui/Meter";
import StatusChip from "./ui/StatusChip";

interface Props {
  label: string;
  value: number;
  unit: string;
  /** 0–100 position on the meter — not always the same as `value`. */
  percent: number;
  tone: Tone;
  alert?: boolean;
}

export default function TelemetryGauge({
  label,
  value,
  unit,
  percent,
  tone,
  alert = false,
}: Props) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className="card card-interactive p-4"
      style={alert ? { borderColor: "var(--danger-line)" } : undefined}
    >
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span className="section-label truncate">{label}</span>
        {alert && (
          <StatusChip tone="danger" className="uppercase tracking-wide">
            Alert
          </StatusChip>
        )}
      </div>

      {/* Value */}
      <p
        className="t-num mt-2.5 text-[1.75rem] font-semibold leading-none tracking-tight"
        style={{ color: alert ? fgVar("danger") : "var(--text-primary)" }}
      >
        {value.toFixed(1)}
        <span className="ml-1 text-sm font-normal" style={{ color: "var(--text-muted)" }}>
          {unit}
        </span>
      </p>

      {/* Meter */}
      <div className="mt-3.5">
        <Meter percent={clamped} tone={tone} label={`${label}: ${value.toFixed(1)}${unit}`} />
      </div>
    </div>
  );
}
