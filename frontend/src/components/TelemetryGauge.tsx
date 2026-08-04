interface Props {
  label: string;
  value: number;
  unit: string;
  /** 0–100 fill percentage */
  percent: number;
  /** Override bar colour via Tailwind class, e.g. "bg-blue-500" */
  colorClass?: string;
  /** Show an alert ring when value is out of the safe range */
  alert?: boolean;
}

export default function TelemetryGauge({
  label,
  value,
  unit,
  percent,
  colorClass = "bg-blue-500",
  alert = false,
}: Props) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900 ${
        alert
          ? "border-red-400 dark:border-red-500"
          : "border-zinc-200 dark:border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {label}
        </span>
        {alert && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">
            Alert
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
        {value.toFixed(1)}
        <span className="ml-1 text-sm font-normal text-zinc-400">{unit}</span>
      </p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-zinc-400 dark:text-zinc-500">
        {clamped.toFixed(0)}%
      </p>
    </div>
  );
}
