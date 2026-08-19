import { getMissions, getTelemetry, getAnomalies, getReports, getMissionHealth } from "@/lib/api";
import type { TelemetryRecord } from "@/lib/types";
import Navbar from "@/components/Navbar";
import MissionHealthScore from "@/components/MissionHealthScore";
import MissionStatusCard from "@/components/MissionStatusCard";
import TelemetryGauge from "@/components/TelemetryGauge";
import TelemetryChart from "@/components/TelemetryChart";
import AnomalyAlert from "@/components/AnomalyAlert";
import AIAnalysisPanel from "@/components/AIAnalysisPanel";
import MissionCommanderPanel from "@/components/MissionCommanderPanel";
import AiReportCard from "@/components/AiReportCard";
import SectionHeader from "@/components/SectionHeader";

export const metadata = { title: "Dashboard — MissionInsights AI" };

// ── Telemetry helpers ────────────────────────────────────────────────────────

function avgMetric(
  records: TelemetryRecord[],
  key: keyof Omit<TelemetryRecord, "id" | "mission_id" | "recorded_at">,
): number {
  if (records.length === 0) return 0;
  return records.reduce((sum, r) => sum + (r[key] as number), 0) / records.length;
}

function tempToPercent(c: number) { return Math.min(100, Math.max(0, ((c + 100) / 300) * 100)); }
function vibToPercent(g: number)  { return Math.min(100, Math.max(0, (g / 10) * 100)); }

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const [missions, telemetry, anomalies, reports] = await Promise.allSettled([
    getMissions(), getTelemetry(), getAnomalies(), getReports(),
  ]);

  const missionData   = missions.status  === "fulfilled" ? missions.value  : [];
  const telemetryData = telemetry.status === "fulfilled" ? telemetry.value : [];
  const anomalyData   = anomalies.status === "fulfilled" ? anomalies.value : [];
  const reportData    = reports.status   === "fulfilled" ? reports.value   : [];

  const primaryMission   = missionData[0]   ?? null;
  const primaryMissionId = primaryMission?.id ?? null;
  const lastTelemetryAt  = telemetryData[0]?.recorded_at ?? null;

  const sortedAnomalies = [...anomalyData].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    const aO = order[a.severity.toLowerCase() as keyof typeof order] ?? 4;
    const bO = order[b.severity.toLowerCase() as keyof typeof order] ?? 4;
    return aO !== bO ? aO - bO : b.confidence - a.confidence;
  });

  const sortedReports = [...reportData].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const battery   = avgMetric(telemetryData, "battery_level");
  const fuel      = avgMetric(telemetryData, "fuel_level");
  const temp      = avgMetric(telemetryData, "temperature");
  const signal    = avgMetric(telemetryData, "signal_strength");
  const vibration = avgMetric(telemetryData, "thruster_vibration");

  const criticalCount = anomalyData.filter((a) => a.severity.toLowerCase() === "critical").length;
  const highCount     = anomalyData.filter((a) => a.severity.toLowerCase() === "high").length;

  return (
    <div className="dash-bg">
      <Navbar mission={primaryMission} lastTelemetryAt={lastTelemetryAt} />

      <main className="dash-content">
        <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">

          {/* ── Page header ── */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {primaryMission
                ? `${primaryMission.mission_name} · ${primaryMission.spacecraft_name}`
                : "Mission Dashboard"}
            </h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Space mission intelligence
              {lastTelemetryAt && (
                <>
                  {" · "}Last telemetry:{" "}
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {new Date(lastTelemetryAt).toLocaleString([], {
                      day: "2-digit", month: "short",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              HERO ROW — 3 columns: Health Score | Mission + Gauges | Anomalies
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_360px]">

            {/* Col 1: Mission Health Score */}
            <MissionHealthWidget missionId={primaryMissionId} />

            {/* Col 2: Mission Status + Telemetry Gauges */}
            <div className="card p-5 shadow-sm flex flex-col gap-4">
              {/* Mission status cards */}
              {missionData.length > 0 ? (
                <div className="space-y-3">
                  {missionData.map((m) => (
                    <MissionStatusCard key={m.id} mission={m} />
                  ))}
                </div>
              ) : (
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>No missions found.</p>
              )}

              {/* Divider */}
              {telemetryData.length > 0 && (
                <div style={{ borderTop: "1px solid var(--border)" }} />
              )}

              {/* Telemetry gauges */}
              {telemetryData.length > 0 && (
                <div>
                  <div className="mb-3">
                    <SectionHeader title="Live Telemetry" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <TelemetryGauge
                      label="Battery"      value={battery}   unit="%"   percent={battery}
                      colorClass={battery < 20 ? "bg-red-500" : battery < 50 ? "bg-amber-400" : "bg-emerald-500"}
                      alert={battery < 20}
                    />
                    <TelemetryGauge
                      label="Fuel"         value={fuel}      unit="%"   percent={fuel}
                      colorClass={fuel < 15 ? "bg-red-500" : fuel < 40 ? "bg-amber-400" : "bg-blue-500"}
                      alert={fuel < 15}
                    />
                    <TelemetryGauge
                      label="Temperature"  value={temp}      unit="°C"  percent={tempToPercent(temp)}
                      colorClass={temp > 150 || temp < -60 ? "bg-red-500" : temp > 80 ? "bg-orange-400" : "bg-sky-500"}
                      alert={temp > 150 || temp < -60}
                    />
                    <TelemetryGauge
                      label="Signal"       value={signal}    unit="dBm" percent={Math.min(100, Math.max(0, signal))}
                      colorClass={signal < 25 ? "bg-red-500" : signal < 50 ? "bg-amber-400" : "bg-indigo-500"}
                      alert={signal < 25}
                    />
                    <TelemetryGauge
                      label="Vibration"    value={vibration} unit="g"   percent={vibToPercent(vibration)}
                      colorClass={vibration > 7 ? "bg-red-500" : vibration > 4 ? "bg-orange-400" : "bg-teal-500"}
                      alert={vibration > 7}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Col 3: Active Anomalies */}
            <div className="card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <SectionHeader title="Active Anomalies" count={anomalyData.length} />
                </div>
                <div className="flex items-center gap-1.5">
                  {criticalCount > 0 && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
                      {criticalCount} critical
                    </span>
                  )}
                  {highCount > 0 && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c" }}>
                      {highCount} high
                    </span>
                  )}
                </div>
              </div>
              {sortedAnomalies.length === 0 ? (
                <div
                  className="rounded-lg px-4 py-3 text-xs"
                  style={{
                    border: "1px solid rgba(34,197,94,0.3)",
                    background: "rgba(34,197,94,0.08)",
                    color: "#4ade80",
                  }}
                >
                  ✓ No anomalies detected
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedAnomalies.map((a) => (
                    <AnomalyAlert key={a.id} anomaly={a} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              TELEMETRY HISTORY — full width, two charts
              ═══════════════════════════════════════════════════════════════ */}
          {telemetryData.length >= 2 && (
            <div className="card p-5 shadow-sm">
              <div className="mb-4">
                <SectionHeader title="Telemetry History" />
              </div>
              <TelemetryChart data={telemetryData} />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              AI ROW — Analysis | Mission Commander
              ═══════════════════════════════════════════════════════════════ */}
          {primaryMissionId !== null && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AIAnalysisPanel missionId={primaryMissionId} />
              <MissionCommanderPanel missionId={primaryMissionId} />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              AI REPORTS — 2-col grid
              ═══════════════════════════════════════════════════════════════ */}
          {reportData.length > 0 && (
            <div>
              <div className="mb-3">
                <SectionHeader title="AI-Generated Reports" count={reportData.length} />
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {sortedReports.map((r) => (
                  <AiReportCard key={r.id} report={r} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// ── Server helper ──────────────────────────────────────────────────────────────

async function MissionHealthWidget({ missionId }: { missionId: number | null }) {
  if (missionId === null) return null;
  let healthData: Awaited<ReturnType<typeof getMissionHealth>> | null = null;
  try { healthData = await getMissionHealth(missionId); } catch { return null; }
  return (
    <MissionHealthScore
      score={healthData.score}
      status={healthData.status}
      factors={healthData.factors}
      anomalyPenalty={healthData.anomaly_penalty}
    />
  );
}
