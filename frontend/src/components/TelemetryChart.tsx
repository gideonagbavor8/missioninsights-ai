"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface TelemetryPoint {
  id: number;
  battery_level: number;
  fuel_level: number;
  temperature: number;
  signal_strength: number;
  thruster_vibration: number;
  recorded_at: string;
}

interface Props { data: TelemetryPoint[]; }

// These are applied at render time so they respond to CSS vars via JS
const TICK_DARK  = { fontSize: 10, fill: "#6e7681" };
const TICK_LIGHT = { fontSize: 10, fill: "#94a3b8" };
const GRID_DARK  = "rgba(255,255,255,0.07)";
const GRID_LIGHT = "rgba(0,0,0,0.07)";
const LEGEND     = { fontSize: 11, paddingTop: 8 };

function getChartTheme() {
  if (typeof document === "undefined") return { tick: TICK_DARK, grid: GRID_DARK, tooltipBg: "#1f2937", tooltipColor: "#f0f6fc", tooltipBorder: "rgba(255,255,255,0.1)" };
  const isDark = document.documentElement.classList.contains("dark");
  return isDark
    ? { tick: TICK_DARK,  grid: GRID_DARK,  tooltipBg: "#1f2937", tooltipColor: "#f0f6fc", tooltipBorder: "rgba(255,255,255,0.1)" }
    : { tick: TICK_LIGHT, grid: GRID_LIGHT, tooltipBg: "#ffffff",  tooltipColor: "#0f172a", tooltipBorder: "rgba(0,0,0,0.1)" };
}

export default function TelemetryChart({ data }: Props) {
  const chartData = [...data].reverse().map((d) => ({
    time:        new Date(d.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    battery:     d.battery_level,
    fuel:        d.fuel_level,
    signal:      d.signal_strength,
    temperature: d.temperature,
    vibration:   d.thruster_vibration,
  }));

  const theme = getChartTheme();
  const tooltipStyle = {
    fontSize: 11,
    borderRadius: 8,
    border: `1px solid ${theme.tooltipBorder}`,
    background: theme.tooltipBg,
    color: theme.tooltipColor,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Chart A: System Health ── */}
      <div>
        <p className="mb-3 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
          System Health
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="time" tick={theme.tick} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}`} tick={theme.tick} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => [typeof v === "number" ? `${v.toFixed(1)}%` : v, name]}
              />
              <Legend wrapperStyle={LEGEND} iconType="circle" iconSize={7} />
              <Line type="monotone" dataKey="battery"  name="Battery %"  stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
              <Line type="monotone" dataKey="fuel"     name="Fuel %"     stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
              <Line type="monotone" dataKey="signal"   name="Signal %"   stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Chart B: Propulsion & Thermal ── */}
      <div>
        <p className="mb-3 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
          Propulsion &amp; Thermal
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="time" tick={theme.tick} tickLine={false} axisLine={false} />
              <YAxis yAxisId="temp" tickFormatter={(v) => `${v}°`} tick={theme.tick} tickLine={false} axisLine={false} />
              <YAxis yAxisId="vib" orientation="right" tickFormatter={(v) => `${v}g`} tick={theme.tick} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => {
                  if (typeof v !== "number") return [String(v), name];
                  return name === "Vibration g" ? [`${v.toFixed(2)}g`, name] : [`${v.toFixed(1)}°C`, name];
                }}
              />
              <Legend wrapperStyle={LEGEND} iconType="circle" iconSize={7} />
              <Line yAxisId="temp" type="monotone" dataKey="temperature" name="Temperature °C" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
              <Line yAxisId="vib"  type="monotone" dataKey="vibration"   name="Vibration g"    stroke="#14b8a6" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
