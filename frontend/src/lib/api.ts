import type { Mission, TelemetryRecord, Anomaly, AIReport, AIAnalysis, } from "./types";

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

export interface AIAnalysisRequest {
  mission_id: number;
}

export async function analyzeTelemetry(
  data: AIAnalysisRequest,
): Promise<AIAnalysis> {
  const res = await fetch(`${API_BASE}/ai/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`AI analysis error ${res.status}`);
  }

  const result = await res.json();
  return result.ai_report as AIAnalysis;
}


export function getMissionHealth(missionId: number) {
  return fetchJson<{
    score: number;
    status: string;
    factors: {
      battery: number;
      fuel: number;
      signal: number;
      temperature: number;
      vibration: number;
    };
    anomaly_penalty: number;
  }>(`/health/${missionId}`);
}