interface Props {
  label: string;
  value: number;
  unit: string;
  percent: number;
  colorClass?: string;
  alert?: boolean;
}

export default function TelemetryGauge({
  label,
  value,
  unit,
  percent,
  colorClass = "bg-indigo-500",
  alert = false,
}: Props) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className="card p-4 shadow-sm transition-shadow hover:shadow-md"
      style={alert ? { boxShadow: "0 0 0 1px rgba(239,68,68,0.4), 0 1px 3px rgba(0,0,0,0.2)" } : {}}
    >
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="section-label">{label}</span>
        {alert && (
          <span className="rounded-full bg-red-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-400 ring-1 ring-red-500/30">
            Alert
          </span>
        )}
      </div>

      {/* Value */}
      <p className="mt-2 text-2xl font-bold tabular-nums leading-none" style={{ color: "var(--text-primary)" }}>
        {value.toFixed(1)}
        <span className="ml-1 text-sm font-normal" style={{ color: "var(--text-muted)" }}>{unit}</span>
      </p>

      {/* Bar */}
      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className={`h-full rounded-full transition-all duration-500 ${colorClass}`} style={{ width: `${clamped}%` }} />
      </div>

      {/* Percent */}
      <p className="mt-1 text-right text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>
        {clamped.toFixed(0)}%
      </p>
    </div>
  );
}
