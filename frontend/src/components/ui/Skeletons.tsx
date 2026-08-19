/**
 * Suspense fallbacks for the dashboard's streamed regions.
 *
 * Each one mirrors the footprint of the real content so the layout does not
 * jump when the region resolves.
 */

function Bar({ width = "100%", height = 12 }: { width?: string; height?: number }) {
  return <div className="skeleton" style={{ width, height }} />;
}

export function HealthCardSkeleton() {
  return (
    <div className="card flex flex-col p-5" aria-hidden="true">
      <Bar width="9rem" height={11} />
      <div className="mt-4 flex justify-center">
        <div
          className="skeleton"
          style={{ width: 168, height: 96, borderRadius: "84px 84px 0 0" }}
        />
      </div>
      <div className="mt-6 space-y-3">
        {[100, 100, 100, 100, 100].map((w, i) => (
          <Bar key={i} width={`${w}%`} height={6} />
        ))}
      </div>
    </div>
  );
}

export function MissionPanelSkeleton() {
  return (
    <div className="card flex flex-col gap-4 p-5" aria-hidden="true">
      <div
        className="rounded-xl p-4"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <Bar width="4rem" height={10} />
        <div className="mt-2"><Bar width="12rem" height={16} /></div>
        <div className="mt-2"><Bar width="9rem" height={12} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="card p-4">
            <Bar width="3.5rem" height={10} />
            <div className="mt-3"><Bar width="4.5rem" height={22} /></div>
            <div className="mt-3"><Bar height={6} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnomalyFeedSkeleton() {
  return (
    <div className="card p-5" aria-hidden="true">
      <Bar width="8rem" height={14} />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl p-3"
            style={{ border: "1px solid var(--border)" }}
          >
            <Bar width="70%" height={13} />
            <div className="mt-2"><Bar width="90%" height={11} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card p-5" aria-hidden="true">
      <Bar width="10rem" height={14} />
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i}>
            <Bar width="7rem" height={11} />
            <div className="mt-3"><Bar height={256} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div aria-hidden="true">
      <Bar width="11rem" height={14} />
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="card p-4">
            <Bar width="6rem" height={11} />
            <div className="mt-3"><Bar height={12} /></div>
            <div className="mt-2"><Bar width="85%" height={12} /></div>
            <div className="mt-4"><Bar height={52} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeadingSkeleton() {
  return (
    <div className="flex flex-wrap items-baseline gap-3" aria-hidden="true">
      <Bar width="16rem" height={22} />
      <Bar width="12rem" height={12} />
    </div>
  );
}
