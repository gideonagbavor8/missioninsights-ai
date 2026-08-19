/**
 * Single source of truth for status → colour.
 *
 * Components render a `<span className="chip" data-tone={tone}>`; the actual
 * colours live in globals.css and flip with the theme. Anything that needs a
 * raw colour (an SVG stripe, a progress bar fill) reads `solidVar(tone)`.
 */

export type Tone = "ok" | "warn" | "high" | "danger" | "info" | "idle" | "accent" | "neutral";

/** Anomaly / AI-report severity levels. */
const SEVERITY_TONE: Record<string, Tone> = {
  critical: "danger",
  high: "high",
  medium: "warn",
  low: "info",
};

/** Mission lifecycle states. */
const MISSION_TONE: Record<string, Tone> = {
  active: "ok",
  nominal: "ok",
  warning: "warn",
  critical: "danger",
  inactive: "idle",
  completed: "info",
};

/** Mission health verdicts returned by /health/:id. */
const HEALTH_TONE: Record<string, Tone> = {
  healthy: "ok",
  warning: "warn",
  critical: "danger",
};

export function severityTone(severity: string): Tone {
  return SEVERITY_TONE[severity.toLowerCase()] ?? "info";
}

export function missionTone(status: string): Tone {
  return MISSION_TONE[status.toLowerCase()] ?? "idle";
}

export function healthTone(status: string): Tone {
  return HEALTH_TONE[status.toLowerCase()] ?? "warn";
}

/** Rank used to sort anomalies most-severe-first. Lower sorts earlier. */
export function severityRank(severity: string): number {
  const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  return order[severity.toLowerCase()] ?? 4;
}

/** CSS var for the saturated version of a tone — stripes, dots, bar fills. */
export function solidVar(tone: Tone): string {
  if (tone === "accent") return "var(--accent)";
  if (tone === "neutral") return "var(--text-muted)";
  return `var(--${tone}-solid)`;
}

/** CSS var for the readable text colour of a tone. */
export function fgVar(tone: Tone): string {
  if (tone === "accent") return "var(--accent-text)";
  if (tone === "neutral") return "var(--text-secondary)";
  return `var(--${tone}-fg)`;
}

/**
 * Maps a 0–100 metric to a tone. `bands` are the lower bounds for warn and ok,
 * so a battery at 18 with bands [20, 50] reads as danger.
 */
export function metricTone(value: number, [warnAt, okAt]: [number, number]): Tone {
  if (value < warnAt) return "danger";
  if (value < okAt) return "warn";
  return "ok";
}
