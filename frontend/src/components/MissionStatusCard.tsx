import type { Mission } from "@/lib/types";

const STATUS_STYLES: Record<string, { dot: string; badge: string }> = {
  active:    { dot: "bg-green-500",  badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
  nominal:   { dot: "bg-green-500",  badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
  warning:   { dot: "bg-yellow-400", badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300" },
  critical:  { dot: "bg-red-500",    badge: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
  inactive:  { dot: "bg-zinc-400",   badge: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300" },
  completed: { dot: "bg-blue-500",   badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
};

function getStyle(status: string) {
  return STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.inactive;
}

interface Props {
  mission: Mission;
}

export default function MissionStatusCard({ mission }: Props) {
  const style = getStyle(mission.status);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Mission
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {mission.mission_name}
          </h2>
          <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">
            Spacecraft: <span className="font-medium text-zinc-700 dark:text-zinc-300">{mission.spacecraft_name}</span>
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {mission.status}
        </span>
      </div>
    </div>
  );
}
