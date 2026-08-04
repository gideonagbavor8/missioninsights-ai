import type { Mission, TelemetryRecord, Anomaly, AIReport } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export function getMissions(): Promise<Mission[]> {
  return fetchJson<Mission[]>("/missions/");
}

export function getTelemetry(): Promise<TelemetryRecord[]> {
  return fetchJson<TelemetryRecord[]>("/telemetry/");
}

export function getAnomalies(): Promise<Anomaly[]> {
  return fetchJson<Anomaly[]>("/anomalies/");
}

export function getReports(): Promise<AIReport[]> {
  return fetchJson<AIReport[]>("/reports/");
}
