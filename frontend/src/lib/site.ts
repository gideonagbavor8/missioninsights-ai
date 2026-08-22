/**
 * Shared site-level constants, so the nav, footer and metadata cannot drift.
 */

export const SITE = {
  name: "MissionInsights AI",
  tagline: "AI-powered space mission intelligence.",
  description:
    "AI-powered spacecraft telemetry monitoring, anomaly detection, mission health analysis and mission intelligence.",
  /** Matches the repository's `origin` remote. */
  github: "https://github.com/gideonagbavor8/missioninsights-ai",
} as const;

/** In-page section ids used by the landing nav and the secondary hero CTA. */
export const SECTIONS = {
  platform: "platform",
  intelligence: "intelligence",
  dashboard: "dashboard-preview",
  technology: "technology",
} as const;
