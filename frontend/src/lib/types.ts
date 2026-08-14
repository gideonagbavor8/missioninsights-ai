export interface Mission {
  id: number;
  mission_name: string;
  spacecraft_name: string;
  status: string;
}

export interface TelemetryRecord {
  id: number;
  mission_id: number;
  battery_level: number;
  fuel_level: number;
  temperature: number;
  signal_strength: number;
  thruster_vibration: number;
  recorded_at: string;
}

export interface Anomaly {
  id: number;
  mission_id: number;
  issue: string;
  severity: "critical" | "high" | "medium" | "low" | string;
  confidence: number;
  recommended_action: string;
  detected_at: string;
}

export interface AIReport {
  id: number;
  mission_id: number;
  summary: string;
  risk_level: "critical" | "high" | "medium" | "low" | string;
  recommendation: string;
  created_at: string;
}

export interface AIAnalysis {
  health_summary: string;
  anomalies: string[];
  risk_level: string;
  recommendations: string[];
}
