import { Suspense } from "react";

import type { TelemetryRecord } from "@/lib/types";
import {
  loadMissions,
  loadTelemetry,
  loadPrimaryMission,
  loadSortedAnomalies,
  loadSortedReports,
  loadHealth,
} from "@/lib/server-data";
import { metricTone, type Tone } from "@/lib/tone";

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
import StatusChip from "@/components/ui/StatusChip";
import {
  HeadingSkeleton,
  HealthCardSkeleton,
  MissionPanelSkeleton,
  AnomalyFeedSkeleton,
  ChartSkeleton,
  ReportsSkeleton,
} from "@/components/ui/Skeletons";

export const metadata = { title: "Dashboard — MissionInsights AI" };

// ── Telemetry helpers ────────────────────────────────────────────────────────

type MetricKey = keyof Omit<TelemetryRecord, "id" | "mission_id" | "recorded_at">;

function avgMetric(records: TelemetryRecord[], key: MetricKey): number {
  if (records.length === 0) return 0;
  return records.reduce((sum, r) => sum + (r[key] as number), 0) / records.length;
}

const clampPercent = (n: number) => Math.min(100, Math.max(0, n));

/** Maps −100…200 °C onto the meter track. */
const tempToPercent = (c: number) => clampPercent(((c + 100) / 300) * 100);
const vibToPercent = (g: number) => clampPercent((g / 10) * 100);

/** Temperature is bad in both directions, so it cannot use `metricTone`. */
function temperatureTone(c: number): Tone {
  if (c > 150 || c < -60) return "danger";
  if (c > 80) return "warn";
  return "ok";
}

/** Vibration is inverted — higher is worse. */
function vibrationTone(g: number): Tone {
  if (g > 7) return "danger";
  if (g > 4) return "warn";
  return "ok";
}

// ── Page shell ───────────────────────────────────────────────────────────────

/**
 * The shell renders synchronously and streams each region in behind its own
 * <Suspense> boundary. Nothing here awaits data, so the navigation, background
 * and layout paint immediately instead of waiting on the slowest endpoint.
 */
export default function DashboardPage() {
  return (
    <div className="dash-bg">
      <Suspense fallback={<Navbar mission={null} />}>
        <NavbarRegion />
      </Suspense>

      <main className="dash-content">
        <div className="mx-auto max-w-screen-2xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">

          <Suspense fallback={<HeadingSkeleton />}>
            <PageHeading />
          </Suspense>

          {/* ── Hero row: health · mission + gauges · anomalies ── */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_380px]">
            <Suspense fallback={<HealthCardSkeleton />}>
              <HealthRegion />
            </Suspense>

            <Suspense fallback={<MissionPanelSkeleton />}>
              <MissionRegion />
            </Suspense>

            <div className="lg:col-span-2 xl:col-span-1">
              <Suspense fallback={<AnomalyFeedSkeleton />}>
                <AnomalyRegion />
              </Suspense>
            </div>
          </div>

          <Suspense fallback={<ChartSkeleton />}>
            <HistoryRegion />
          </Suspense>

          <Suspense fallback={null}>
            <AIRegion />
          </Suspense>

          <Suspense fallback={<ReportsSkeleton />}>
            <ReportsRegion />
          </Suspense>

        </div>
      </main>
    </div>
  );
}

// ── Streamed regions ─────────────────────────────────────────────────────────

async function NavbarRegion() {
  const [mission, telemetry] = await Promise.all([loadPrimaryMission(), loadTelemetry()]);
  return <Navbar mission={mission} lastTelemetryAt={telemetry[0]?.recorded_at ?? null} />;
}

async function PageHeading() {
  const [mission, telemetry] = await Promise.all([loadPrimaryMission(), loadTelemetry()]);
  const lastTelemetryAt = telemetry[0]?.recorded_at ?? null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {mission
          ? `${mission.mission_name} · ${mission.spacecraft_name}`
          : "Mission Dashboard"}
      </h1>
      <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
        Space mission intelligence
        {lastTelemetryAt && (
          <>
            {" · "}Last telemetry{" "}
            <span className="t-num font-medium" style={{ color: "var(--text-primary)" }}>
              {new Date(lastTelemetryAt).toLocaleString([], {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </>
        )}
      </p>
    </div>
  );
}

async function HealthRegion() {
  const mission = await loadPrimaryMission();
  if (!mission) return null;

  const health = await loadHealth(mission.id);
  if (!health) return null;

  return (
    <MissionHealthScore
      score={health.score}
      status={health.status}
      factors={health.factors}
      anomalyPenalty={health.anomaly_penalty}
    />
  );
}

async function MissionRegion() {
  const [missions, telemetry] = await Promise.all([loadMissions(), loadTelemetry()]);

  const battery = avgMetric(telemetry, "battery_level");
  const fuel = avgMetric(telemetry, "fuel_level");
  const temp = avgMetric(telemetry, "temperature");
  const signal = avgMetric(telemetry, "signal_strength");
  const vibration = avgMetric(telemetry, "thruster_vibration");

  return (
    <div className="card flex flex-col gap-4 p-5">
      {missions.length > 0 ? (
        <div className="space-y-3">
          {missions.map((m) => (
            <MissionStatusCard key={m.id} mission={m} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No missions found"
          detail="Check that the telemetry API is reachable."
        />
      )}

      {telemetry.length > 0 && (
        <div className="pt-1" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="mb-3 mt-3">
            <SectionHeader
              title="Live Telemetry"
              hint={`Averaged across ${telemetry.length} recent readings`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <TelemetryGauge
              label="Battery" value={battery} unit="%" percent={battery}
              tone={metricTone(battery, [20, 50])} alert={battery < 20}
            />
            <TelemetryGauge
              label="Fuel" value={fuel} unit="%" percent={fuel}
              tone={metricTone(fuel, [15, 40])} alert={fuel < 15}
            />
            <TelemetryGauge
              label="Temperature" value={temp} unit="°C" percent={tempToPercent(temp)}
              tone={temperatureTone(temp)} alert={temp > 150 || temp < -60}
            />
            <TelemetryGauge
              label="Signal" value={signal} unit="dBm" percent={clampPercent(signal)}
              tone={metricTone(signal, [25, 50])} alert={signal < 25}
            />
            <TelemetryGauge
              label="Vibration" value={vibration} unit="g" percent={vibToPercent(vibration)}
              tone={vibrationTone(vibration)} alert={vibration > 7}
            />
          </div>
        </div>
      )}
    </div>
  );
}

async function AnomalyRegion() {
  const anomalies = await loadSortedAnomalies();

  const criticalCount = anomalies.filter((a) => a.severity.toLowerCase() === "critical").length;
  const highCount = anomalies.filter((a) => a.severity.toLowerCase() === "high").length;

  return (
    <div className="card flex h-full flex-col p-5">
      <SectionHeader
        title="Active Anomalies"
        count={anomalies.length}
        trailing={
          <>
            {criticalCount > 0 && <StatusChip tone="danger">{criticalCount} critical</StatusChip>}
            {highCount > 0 && <StatusChip tone="high">{highCount} high</StatusChip>}
          </>
        }
      />

      {anomalies.length === 0 ? (
        <div
          className="t-body mt-4 flex items-center gap-2 rounded-lg px-4 py-3.5"
          style={{
            border: "1px solid var(--ok-line)",
            background: "var(--ok-bg)",
            color: "var(--ok-fg)",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
          All systems nominal — no anomalies detected.
        </div>
      ) : (
        <div className="scroll-region -mr-1 mt-4 space-y-2 pr-1" style={{ maxHeight: 520 }}>
          {anomalies.map((a) => (
            <AnomalyAlert key={a.id} anomaly={a} />
          ))}
        </div>
      )}
    </div>
  );
}

async function HistoryRegion() {
  const telemetry = await loadTelemetry();
  if (telemetry.length < 2) return null;

  return (
    <div className="card p-5">
      <div className="mb-4">
        <SectionHeader
          title="Telemetry History"
          hint={`${telemetry.length} readings, newest last`}
        />
      </div>
      <TelemetryChart data={telemetry} />
    </div>
  );
}

async function AIRegion() {
  const mission = await loadPrimaryMission();
  if (!mission) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <AIAnalysisPanel missionId={mission.id} />
      <MissionCommanderPanel missionId={mission.id} />
    </div>
  );
}

/** Reports shown before the list folds into a "show older" disclosure. */
const REPORTS_VISIBLE = 4;

async function ReportsRegion() {
  const reports = await loadSortedReports();
  if (reports.length === 0) return null;

  const recent = reports.slice(0, REPORTS_VISIBLE);
  const older = reports.slice(REPORTS_VISIBLE);

  return (
    <div>
      <div className="mb-3">
        <SectionHeader
          title="AI-Generated Reports"
          count={reports.length}
          hint="Newest first — select a report to read it in full"
        />
      </div>

      <div className="grid items-start gap-2.5 lg:grid-cols-2">
        {recent.map((r, i) => (
          <AiReportCard key={r.id} report={r} defaultOpen={i === 0} />
        ))}
      </div>

      {older.length > 0 && (
        <details className="disclosure mt-2.5">
          <summary
            className="mx-auto flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors"
            style={{
              border: "1px solid var(--border)",
              background: "var(--surface-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            <span className="disclosure-teaser">Show {older.length} older</span>
            <span className="disclosure-label-open">Hide older reports</span>
            <span className="disclosure-chevron" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </span>
          </summary>

          <div className="mt-2.5 grid items-start gap-2.5 lg:grid-cols-2">
            {older.map((r) => (
              <AiReportCard key={r.id} report={r} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// ── Shared empty state ───────────────────────────────────────────────────────

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div
      className="rounded-xl px-4 py-6 text-center"
      style={{ background: "var(--bg-elevated)", border: "1px dashed var(--border-strong)" }}
    >
      <p className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      <p className="t-meta mt-1">{detail}</p>
    </div>
  );
}
