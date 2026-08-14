import { getMissions, getTelemetry, getAnomalies, getReports } from "@/lib/api";
import type { TelemetryRecord } from "@/lib/types";
import MissionStatusCard from "@/components/MissionStatusCard";
import TelemetryGauge from "@/components/TelemetryGauge";
import AnomalyAlert from "@/components/AnomalyAlert";
import AiReportCard from "@/components/AiReportCard";
import SectionHeader from "@/components/SectionHeader";
import AIAnalysisPanel from "@/components/AIAnalysisPanel";

export const metadata = {
  title: "Dashboard — MissionInsights AI",
};

// ── Telemetry helpers ────────────────────────────────────────────────────────

/** Average a numeric key across all telemetry records for a given mission. */
function avgMetric(
  records: TelemetryRecord[],
  key: keyof Omit<TelemetryRecord, "id" | "mission_id" | "recorded_at">,
): number {
  if (records.length === 0) return 0;
  return records.reduce((sum, r) => sum + (r[key] as number), 0) / records.length;
}

function tempToPercent(celsius: number): number {
  // Map –100 °C → 0%, 200 °C → 100%
  return Math.min(100, Math.max(0, ((celsius + 100) / 300) * 100));
}

function vibrationToPercent(g: number): number {
  // Map 0 g → 0%, 10 g → 100%
  return Math.min(100, Math.max(0, (g / 10) * 100));
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Parallel data fetching — each call is independent
  const [missions, telemetry, anomalies, reports] = await Promise.allSettled([
    getMissions(),
    getTelemetry(),
    getAnomalies(),
    getReports(),
  ]);

  const missionData   = missions.status   === "fulfilled" ? missions.value   : [];
  const telemetryData = telemetry.status  === "fulfilled" ? telemetry.value  : [];
  const anomalyData   = anomalies.status  === "fulfilled" ? anomalies.value  : [];
  const reportData    = reports.status    === "fulfilled" ? reports.value    : [];

  // Sort anomalies: critical first, then descending confidence
  const sortedAnomalies = [...anomalyData].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    const aOrder = order[a.severity.toLowerCase() as keyof typeof order] ?? 4;
    const bOrder = order[b.severity.toLowerCase() as keyof typeof order] ?? 4;
    return aOrder !== bOrder ? aOrder - bOrder : b.confidence - a.confidence;
  });

  // Latest report first
  const sortedReports = [...reportData].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // Aggregate telemetry across all missions for the summary gauges
  const battery    = avgMetric(telemetryData, "battery_level");
  const fuel       = avgMetric(telemetryData, "fuel_level");
  const temp       = avgMetric(telemetryData, "temperature");
  const signal     = avgMetric(telemetryData, "signal_strength");
  const vibration  = avgMetric(telemetryData, "thruster_vibration");

  const criticalCount = anomalyData.filter(
    (a) => a.severity.toLowerCase() === "critical",
  ).length;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            MissionInsights AI
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Space mission intelligence dashboard
          </p>
        </div>

        {/* ── Mission Status ── */}
        <section aria-labelledby="missions-heading" className="space-y-4">
          <SectionHeader
            title="Mission Status"
            count={missionData.length}
          />
          {missionData.length === 0 ? (
            <EmptyState message="No missions found." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {missionData.map((mission) => (
                <MissionStatusCard key={mission.id} mission={mission} />
              ))}
            </div>
          )}
        </section>

        {/* ── Telemetry Metrics ── */}
        <section aria-labelledby="telemetry-heading" className="space-y-4">
          <SectionHeader title="Telemetry Metrics" />
          {telemetryData.length === 0 ? (
            <EmptyState message="No telemetry data available." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <TelemetryGauge
                label="Battery"
                value={battery}
                unit="%"
                percent={battery}
                colorClass={battery < 20 ? "bg-red-500" : battery < 50 ? "bg-yellow-400" : "bg-green-500"}
                alert={battery < 20}
              />
              <TelemetryGauge
                label="Fuel"
                value={fuel}
                unit="%"
                percent={fuel}
                colorClass={fuel < 15 ? "bg-red-500" : fuel < 40 ? "bg-yellow-400" : "bg-blue-500"}
                alert={fuel < 15}
              />
              <TelemetryGauge
                label="Temperature"
                value={temp}
                unit="°C"
                percent={tempToPercent(temp)}
                colorClass={temp > 150 || temp < -60 ? "bg-red-500" : temp > 80 ? "bg-orange-400" : "bg-sky-500"}
                alert={temp > 150 || temp < -60}
              />
              <TelemetryGauge
                label="Signal Strength"
                value={signal}
                unit="dBm"
                percent={Math.min(100, Math.max(0, signal))}
                colorClass={signal < 25 ? "bg-red-500" : signal < 50 ? "bg-yellow-400" : "bg-indigo-500"}
                alert={signal < 25}
              />
              <TelemetryGauge
                label="Thruster Vibration"
                value={vibration}
                unit="g"
                percent={vibrationToPercent(vibration)}
                colorClass={vibration > 7 ? "bg-red-500" : vibration > 4 ? "bg-orange-400" : "bg-teal-500"}
                alert={vibration > 7}
              />
            </div>
          )}
        </section>

        {/* ── Anomaly Alerts ── */}
        <section aria-labelledby="anomalies-heading" className="space-y-4">
          <div className="flex items-center gap-3">
            <SectionHeader
              title="Anomaly Alerts"
              count={anomalyData.length}
            />
            {criticalCount > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">
                {criticalCount} critical
              </span>
            )}
          </div>
          {sortedAnomalies.length === 0 ? (
            <EmptyState message="No anomalies detected." variant="success" />
          ) : (
            <div className="space-y-3">
              {sortedAnomalies.map((anomaly) => (
                <AnomalyAlert key={anomaly.id} anomaly={anomaly} />
              ))}
            </div>
          )}
        </section>
	{/* AI Mission Analysis */}
{missionData.length > 0 && telemetryData.length > 0 && (
  <AIAnalysisPanel
    mission={missionData[0].mission_name}
    spacecraftId={missionData[0].spacecraft_name}
    battery={telemetryData[0].battery_level}
    fuel={telemetryData[0].fuel_level}
    temperature={telemetryData[0].temperature}
    signalStrength={telemetryData[0].signal_strength}
    vibration={telemetryData[0].thruster_vibration}
  />
)}






        {/* ── AI Reports ── */}
        <section aria-labelledby="reports-heading" className="space-y-4">
          <SectionHeader
            title="AI-Generated Reports"
            count={reportData.length}
          />
          {sortedReports.length === 0 ? (
            <EmptyState message="No AI reports generated yet." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {sortedReports.map((report) => (
                <AiReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function EmptyState({
  message,
  variant = "neutral",
}: {
  message: string;
  variant?: "neutral" | "success";
}) {
  return (
    <div
      className={`rounded-xl border px-6 py-8 text-center text-sm ${
        variant === "success"
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400"
          : "border-zinc-200 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
      }`}
    >
      {message}
    </div>
  );
}
