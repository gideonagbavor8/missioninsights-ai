interface FactorScores {
  battery: number;
  fuel: number;
  signal: number;
  temperature: number;
  vibration: number;
}

interface Props {
  score: number;
  status: string;
  factors: FactorScores;
  anomalyPenalty: number;
}

const STATUS_CFG: Record<string, { ring: string; label: string; glow: string }> = {
  Healthy:  { ring: "#22c55e", label: "#22c55e", glow: "rgba(34,197,94,0.15)" },
  Warning:  { ring: "#f59e0b", label: "#f59e0b", glow: "rgba(245,158,11,0.15)" },
  Critical: { ring: "#ef4444", label: "#ef4444", glow: "rgba(239,68,68,0.15)"  },
};

function getCfg(status: string) {
  return STATUS_CFG[status] ?? STATUS_CFG.Warning;
}

function factorColor(v: number) {
  if (v >= 70) return "#22c55e";
  if (v >= 40) return "#f59e0b";
  return "#ef4444";
}

/** 220° arc gauge — cx/cy is the visual centre of the arc circle */
function ArcGauge({ pct, color, glow }: { pct: number; color: string; glow: string }) {
  const r = 52, cx = 64, cy = 68;
  const sweep = 220, start = 160;
  const filled = (Math.min(100, Math.max(0, pct)) / 100) * sweep;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt = (d: number) => ({ x: cx + r * Math.cos(toRad(d)), y: cy + r * Math.sin(toRad(d)) });
  const s = pt(start), eBg = pt(start + sweep), eFill = pt(start + filled);

  return (
    <svg viewBox="0 0 128 100" className="w-full max-w-[168px]" aria-hidden="true">
      <defs>
        <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Track */}
      <path
        d={`M${s.x} ${s.y} A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${eBg.x} ${eBg.y}`}
        fill="none" strokeWidth="8" strokeLinecap="round"
        stroke="rgba(255,255,255,0.08)"
      />
      {/* Fill */}
      {pct > 0 && (
        <path
          d={`M${s.x} ${s.y} A${r} ${r} 0 ${filled > 180 ? 1 : 0} 1 ${eFill.x} ${eFill.y}`}
          fill="none" strokeWidth="8" strokeLinecap="round"
          stroke={color}
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
        />
      )}
    </svg>
  );
}

export default function MissionHealthScore({ score, status, factors, anomalyPenalty }: Props) {
  const cfg     = getCfg(status);
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className="card p-5 shadow-sm flex flex-col">
      <p className="section-label">Mission Health Score</p>

      {/* Arc gauge — fixed height so overlay is always centred on the arc circle */}
      <div className="relative mt-2 flex justify-center" style={{ height: 130 }}>
        <div className="absolute inset-0 flex justify-center">
          <ArcGauge pct={clamped} color={cfg.ring} glow={cfg.glow} />
        </div>
        {/* Score overlay — centred on the arc centre (cy=68/100 × 130px ≈ top:58%) */}
        <div
          className="absolute flex flex-col items-center text-center"
          style={{ top: "38%", left: 0, right: 0, transform: "translateY(-50%)" }}
        >
          <span
            className="text-5xl font-bold tabular-nums leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            {clamped}
          </span>
          <span className="mt-0.5 text-[11px]" style={{ color: "var(--text-secondary)" }}>/100</span>
          <span
            className="mt-1.5 text-xs font-bold uppercase tracking-wide"
            style={{ color: cfg.label }}
          >
            {status}
          </span>
          {anomalyPenalty > 0 && (
            <span className="mt-1 text-[10px] leading-tight text-red-400">
              −{anomalyPenalty} pts anomaly
            </span>
          )}
        </div>
      </div>

      {/* Factor bars */}
      <div className="mt-4 space-y-2.5">
        {(
          [
            ["Battery",     factors.battery],
            ["Fuel",        factors.fuel],
            ["Signal",      factors.signal],
            ["Temperature", factors.temperature],
            ["Vibration",   factors.vibration],
          ] as [string, number][]
        ).map(([label, val]) => {
          const v = Math.min(100, Math.max(0, val));
          return (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span
                  className="text-[10px] font-semibold tabular-nums"
                  style={{ color: "var(--text-primary)" }}
                >
                  {v}
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: "var(--bg-elevated)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${v}%`, backgroundColor: factorColor(v) }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
