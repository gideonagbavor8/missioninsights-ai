/**
 * Abstract mission-intelligence visual for the hero.
 *
 * Pure inline SVG driven by CSS keyframes (see globals.css) — no canvas, no
 * animation library, no client JS. Everything animated is opacity/transform so
 * it stays on the compositor, and the global reduced-motion rule freezes it.
 *
 * Reads as: a tracked spacecraft on its orbit, a telemetry trace, and a health
 * arc — the same three ideas the product is built on.
 */
export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[480px]" aria-hidden="true">
      <svg viewBox="0 0 400 400" className="h-auto w-full" role="presentation">
        <defs>
          <linearGradient id="hero-trace" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--brand-signal)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--brand-signal)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--brand-signal)" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Range rings */}
        {[168, 124, 80].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="1"
            opacity={0.6 - i * 0.12}
          />
        ))}

        {/* Crosshairs */}
        <line x1="200" y1="18" x2="200" y2="382" stroke="var(--border)" strokeWidth="1" />
        <line x1="18" y1="200" x2="382" y2="200" stroke="var(--border)" strokeWidth="1" />

        {/* Outer orbit + spacecraft node */}
        <g className="orbit-rotate">
          <ellipse
            cx="200"
            cy="200"
            rx="168"
            ry="66"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.6"
            opacity="0.55"
          />
          <g transform="translate(368 200)">
            <circle
              className="node-pulse"
              r="4"
              style={{ fill: "var(--brand-signal)", transformOrigin: "center" }}
            />
            <circle r="4" style={{ fill: "var(--brand-signal)" }} />
          </g>
        </g>

        {/* Inner counter-orbit */}
        <g className="orbit-rotate-slow">
          <ellipse
            cx="200"
            cy="200"
            rx="112"
            ry="44"
            fill="none"
            stroke="var(--accent-text)"
            strokeWidth="1.4"
            opacity="0.4"
            transform="rotate(58 200 200)"
          />
        </g>

        {/* Spacecraft core */}
        <circle cx="200" cy="200" r="26" fill="var(--bg-card)" stroke="var(--border-strong)" strokeWidth="1" />
        <circle cx="200" cy="200" r="9" style={{ fill: "var(--accent)" }} />

        {/* Telemetry trace across the lower field */}
        <polyline
          className="trace-line"
          points="46,318 86,306 116,322 150,290 186,300 220,268 258,282 296,250 336,262 358,244"
          fill="none"
          stroke="url(#hero-trace)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sampled data points on the trace */}
        {[
          [150, 290],
          [220, 268],
          [296, 250],
        ].map(([x, y]) => (
          <circle key={`${x}`} cx={x} cy={y} r="2.6" style={{ fill: "var(--brand-signal)" }} />
        ))}

        {/* Mission-health arc — sits exactly on the outer range ring (r=168) so
            it reads as a gauge segment on the track, not a stray stroke. */}
        <path
          d="M 34.6 170.8 A 168 168 0 0 1 142.5 42.1"
          fill="none"
          stroke="var(--ok-solid)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
