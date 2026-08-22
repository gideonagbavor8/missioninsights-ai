/**
 * MissionInsights AI brand mark — "Orbital Track".
 *
 * Three elements, no gradients and no glow:
 *   1. A solid core            — the spacecraft under observation
 *   2. An OPEN elliptical orbit — the track flown so far; the gap reads as a
 *                                sweep still in progress rather than a closed ring
 *   3. A node at the leading tip — current position, and the detected insight
 *
 * The orbit is drawn before the core, so the core occludes it by SVG paint
 * order — no mask, therefore no element ids to collide when several marks
 * render on one page, and the component stays a Server Component (zero JS).
 *
 * Verified legible down to 16px on both light and dark surfaces.
 */

export type LogoVariant = "full" | "compact" | "icon";
export type LogoTone = "auto" | "light" | "dark";

/** Resolved ink colour for the mark's solid geometry. */
const TONE_INK: Record<LogoTone, string> = {
  auto: "currentColor",
  light: "#f8fafc",
  dark: "#0b1120",
};

/**
 * Shared geometry so the React mark and the exported SVG files cannot drift.
 * Arc runs from t=45deg to t=330deg on an rx=13 ry=8.6 ellipse centred at
 * (16,16); the 75deg gap sits on the right, just past the node.
 */
const ORBIT_ARC = "M25.19 22.08 A 13 8.6 0 1 1 27.26 11.70";
const ORBIT_ROTATION = "rotate(-25 16 16)";
const NODE = { cx: 27.26, cy: 11.7, r: 2.8 };
const CORE = { cx: 16, cy: 16, r: 5.5 };

interface LogoMarkProps {
  /** Rendered edge length in px. The mark is square. */
  size?: number;
  tone?: LogoTone;
  className?: string;
  /**
   * Accessible name. Provide this only when the mark stands alone with no
   * adjacent text; otherwise it is decorative and hidden from assistive tech.
   */
  title?: string;
}

export function LogoMark({
  size = 28,
  tone = "auto",
  className = "",
  title,
}: LogoMarkProps) {
  const ink = TONE_INK[tone];

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      shapeRendering="geometricPrecision"
    >
      {title && <title>{title}</title>}

      <g transform={ORBIT_ROTATION}>
        {/* Orbital track */}
        <path
          d={ORBIT_ARC}
          fill="none"
          stroke={ink}
          strokeWidth="1.9"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Signal node — current position on the track */}
        <circle
          cx={NODE.cx}
          cy={NODE.cy}
          r={NODE.r}
          style={{ fill: "var(--brand-signal, #22d3ee)" }}
        />
      </g>

      {/* Spacecraft core — painted last so it occludes the track */}
      <circle cx={CORE.cx} cy={CORE.cy} r={CORE.r} fill={ink} />
    </svg>
  );
}

interface LogoProps extends LogoMarkProps {
  /**
   * `full`    — mark + "MissionInsights AI"  (navbar, landing, share images)
   * `compact` — mark + "MissionInsights"     (tight headers, footers)
   * `icon`    — mark only                    (mobile, avatars, favicon scale)
   */
  variant?: LogoVariant;
}

export default function Logo({
  variant = "full",
  size = 28,
  tone = "auto",
  className = "",
  title,
}: LogoProps) {
  if (variant === "icon") {
    return (
      <LogoMark
        size={size}
        tone={tone}
        className={className}
        title={title ?? "MissionInsights AI"}
      />
    );
  }

  // The wordmark is real text rather than outlines: it stays crisp at every
  // size, remains selectable, and is announced correctly by screen readers.
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} tone={tone} />
      <span
        className="font-bold leading-none tracking-tight whitespace-nowrap"
        style={{
          fontSize: Math.round(size * 0.54),
          color: tone === "auto" ? "var(--text-primary)" : TONE_INK[tone],
        }}
      >
        Mission
        <span style={{ color: "var(--accent-text)" }}>Insights</span>
        {variant === "full" && (
          <span
            className="ml-1 font-semibold"
            style={{ fontSize: Math.round(size * 0.42), letterSpacing: "0.04em" }}
          >
            AI
          </span>
        )}
      </span>
    </span>
  );
}
