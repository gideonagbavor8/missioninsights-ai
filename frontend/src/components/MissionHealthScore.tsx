interface Props {
  score: number;
  status: string;
  factors: {
    battery: number;
    fuel: number;
    signal: number;
    temperature: number;
    vibration: number;
  };
  anomalyPenalty: number;
}

export default function MissionHealthScore({
  score,
  status,
  factors,
  anomalyPenalty,
}: Props) {
  const statusStyle =
    status === "Healthy"
      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
      : status === "Warning"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
        Mission Health Score
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {score} / 100
        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyle}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
        <Metric label="Battery" value={factors.battery} />
        <Metric label="Fuel" value={factors.fuel} />
        <Metric label="Signal" value={factors.signal} />
        <Metric label="Temperature" value={factors.temperature} />
        <Metric label="Vibration" value={factors.vibration} />
      </div>

      {anomalyPenalty > 0 && (
        <p className="mt-4 text-xs text-red-500">
          Anomaly penalty: -{anomalyPenalty} points
        </p>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-zinc-400">{label}</p>
      <p className="font-semibold text-zinc-700 dark:text-zinc-300">
        {value}
      </p>
    </div>
  );
}