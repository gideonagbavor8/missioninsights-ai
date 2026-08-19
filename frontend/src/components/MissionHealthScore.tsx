import { healthTone, metricTone, solidVar, fgVar } from "@/lib/tone";
import Meter from "./ui/Meter";
import StatusChip from "./ui/StatusChip";

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

/* Arc geometry, in viewBox units. */
const R = 52;
const CX = 64;
const CY = 68;
const SWEEP = 220;
const START = 160;
const STROKE = 9;
const VB_W = 128;
const VB_H = 100;

/* Rendered size. Height follows the viewBox aspect so the arc never distorts. */
const GAUGE_W = 176;
const GAUGE_H = Math.round((GAUGE_W * VB_H) / VB_W);

/**
 * Widest text the arc can hold without the glyphs touching the stroke, as a
 * share of the gauge width. This is what the previous version got wrong: the
 * readout was `inset-x-0`, so it stretched to the full card width and the
 * score ran straight through the arc.
 */
const INNER_W_RATIO = (2 * (R - STROKE / 2)) / VB_W;

function ArcGauge({ percent, color }: { percent: number; color: string }) {
  const filled = (percent / 100) * SWEEP;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (deg: number) => ({
    x: CX + R * Math.cos(toRad(deg)),
    y: CY + R * Math.sin(toRad(deg)),
  });

  const from = pt(START);
  const trackTo = pt(START + SWEEP);
  const fillTo = pt(START + filled);

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <path
        d={`M${from.x} ${from.y} A${R} ${R} 0 ${SWEEP > 180 ? 1 : 0} 1 ${trackTo.x} ${trackTo.y}`}
        fill="none"
        strokeWidth={STROKE}
        strokeLinecap="round"
        stroke="var(--track)"
      />
      {percent > 0 && (
        <path
          d={`M${from.x} ${from.y} A${R} ${R} 0 ${filled > 180 ? 1 : 0} 1 ${fillTo.x} ${fillTo.y}`}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          stroke={color}
        />
      )}
    </svg>
  );
}

const FACTOR_LABELS: [keyof FactorScores, string][] = [
  ["battery", "Battery"],
  ["fuel", "Fuel"],
  ["signal", "Signal"],
  ["temperature", "Temperature"],
  ["vibration", "Vibration"],
];

export default function MissionHealthScore({
  score,
  status,
  factors,
  anomalyPenalty,
}: Props) {
  const tone = healthTone(status);
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className="card flex flex-col p-5">
      <p className="section-label">Mission Health</p>

      {/* Gauge — the wrapper is sized to the arc, so the readout is centred on
          the arc rather than on the card, and is capped to the arc's interior. */}
      <div className="mt-4 flex justify-center">
        <div className="relative" style={{ width: GAUGE_W, height: GAUGE_H }}>
          <ArcGauge percent={clamped} color={solidVar(tone)} />

          <div
            className="absolute left-1/2 flex flex-col items-center"
            style={{
              top: `${(CY / VB_H) * 100}%`,
              transform: "translate(-50%, -50%)",
              width: `${INNER_W_RATIO * 100}%`,
            }}
          >
            <span
              className="t-num text-[2.75rem] font-semibold leading-none tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {clamped}
            </span>
            <span className="t-meta mt-1.5">out of 100</span>
          </div>
        </div>
      </div>

      {/* Verdict — sits below the arc so nothing competes for the same space */}
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <StatusChip tone={tone} dot>
          {status}
        </StatusChip>
        {anomalyPenalty > 0 && (
          <p className="t-meta" style={{ color: fgVar("danger") }}>
            −{anomalyPenalty} pts from active anomalies
          </p>
        )}
      </div>

      {/* Factor breakdown */}
      <div className="mt-5 space-y-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        {FACTOR_LABELS.map(([key, label]) => {
          const value = Math.min(100, Math.max(0, factors[key]));
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </span>
                <span
                  className="t-num text-[11px] font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {value}
                </span>
              </div>
              <Meter percent={value} tone={metricTone(value, [40, 70])} size={5} label={label} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
