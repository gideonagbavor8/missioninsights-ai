import { cache } from "react";
import {
  getMissions,
  getTelemetry,
  getAnomalies,
  getReports,
  getMissionHealth,
} from "./api";
import type { Mission, TelemetryRecord, Anomaly, AIReport } from "./types";
import { severityRank } from "./tone";

/**
 * Per-request memoised loaders.
 *
 * The dashboard now streams each region behind its own <Suspense> boundary, so
 * several server components ask for the same collection independently. `cache()`
 * collapses those into one fetch per render pass. Each loader degrades to an
 * empty result instead of throwing, which is what the page's old
 * `Promise.allSettled` was doing — except now one dead endpoint only blanks its
 * own region rather than delaying the whole page.
 */

export const loadMissions = cache(async (): Promise<Mission[]> => {
  try {
    return await getMissions();
  } catch {
    return [];
  }
});

export const loadTelemetry = cache(async (): Promise<TelemetryRecord[]> => {
  try {
    return await getTelemetry();
  } catch {
    return [];
  }
});

export const loadAnomalies = cache(async (): Promise<Anomaly[]> => {
  try {
    return await getAnomalies();
  } catch {
    return [];
  }
});

export const loadReports = cache(async (): Promise<AIReport[]> => {
  try {
    return await getReports();
  } catch {
    return [];
  }
});

export const loadHealth = cache(async (missionId: number) => {
  try {
    return await getMissionHealth(missionId);
  } catch {
    return null;
  }
});

/** The mission the dashboard is currently reporting on. */
export const loadPrimaryMission = cache(async (): Promise<Mission | null> => {
  const missions = await loadMissions();
  return missions[0] ?? null;
});

/** Most-severe first, then most-confident first. */
export const loadSortedAnomalies = cache(async (): Promise<Anomaly[]> => {
  const anomalies = await loadAnomalies();
  return [...anomalies].sort((a, b) => {
    const rank = severityRank(a.severity) - severityRank(b.severity);
    return rank !== 0 ? rank : b.confidence - a.confidence;
  });
});

/** Newest first. */
export const loadSortedReports = cache(async (): Promise<AIReport[]> => {
  const reports = await loadReports();
  return [...reports].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
});
