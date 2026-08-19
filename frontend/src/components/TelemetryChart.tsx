"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useThemeTokens } from "@/lib/useThemeMode";

interface TelemetryPoint {
  id: number;
  battery_level: number;
  fuel_level: number;
  temperature: number;
  signal_strength: number;
  thruster_vibration: number;
  recorded_at: string;
}

interface Props {
  data: TelemetryPoint[];
}

/**
 * Recharts paints into SVG presentation attributes, which cannot read CSS
 * custom properties — so the tokens are resolved in JS and re-read whenever the
 * theme flips. Previously this was read once at render, which left the axes and
 * grid stuck on dark colours after switching to light mode.
 */
const TOKENS = {
  grid: "--chart-grid",
  tick: "--chart-tick",
  card: "--bg-card",
  border: "--border",
  text: "--text-primary",
} as const;

const FALLBACK = {
  grid: "rgba(255,255,255,0.07)",
  tick: "#7d8794",
  card: "#161b22",
  border: "rgba(255,255,255,0.08)",
  text: "#f0f6fc",
};

const SERIES = {
  battery: "#22c55e",
  fuel: "#f97316",
  signal: "#3b82f6",
  temperature: "#ef4444",
  vibration: "#14b8a6",
} as const;

export default function TelemetryChart({ data }: Props) {
  const theme = useThemeTokens(TOKENS, FALLBACK);

  const chartData = [...data].reverse().map((d) => ({
    time: new Date(d.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    battery: d.battery_level,
    fuel: d.fuel_level,
    signal: d.signal_strength,
    temperature: d.temperature,
    vibration: d.thruster_vibration,
  }));

  const tick = { fontSize: 11, fill: theme.tick };

  const tooltipStyle = {
    fontSize: 12,
    borderRadius: 10,
    border: `1px solid ${theme.border}`,
    background: theme.card,
    color: theme.text,
    boxShadow: "0 8px 24px -8px rgba(0,0,0,0.35)",
  };

  const legendStyle = { fontSize: 11, paddingTop: 10, color: theme.tick };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ── System Health ── */}
      <section>
        <h3 className="section-label mb-3">System Health</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
              <XAxis dataKey="time" tick={tick} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis domain={[0, 100]} tick={tick} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ stroke: theme.border, strokeWidth: 1 }}
                formatter={(v, name) => [typeof v === "number" ? `${v.toFixed(1)}%` : v, name]}
              />
              <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="battery" name="Battery" stroke={SERIES.battery} strokeWidth={2} dot={false} activeDot={{ r: 3.5 }} />
              <Line type="monotone" dataKey="fuel"    name="Fuel"    stroke={SERIES.fuel}    strokeWidth={2} dot={false} activeDot={{ r: 3.5 }} />
              <Line type="monotone" dataKey="signal"  name="Signal"  stroke={SERIES.signal}  strokeWidth={2} dot={false} activeDot={{ r: 3.5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Propulsion & Thermal ── */}
      <section>
        <h3 className="section-label mb-3">Propulsion &amp; Thermal</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
              <XAxis dataKey="time" tick={tick} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis yAxisId="temp" tickFormatter={(v) => `${v}°`} tick={tick} tickLine={false} axisLine={false} width={40} />
              <YAxis yAxisId="vib" orientation="right" tickFormatter={(v) => `${v}g`} tick={tick} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ stroke: theme.border, strokeWidth: 1 }}
                formatter={(v, name) => {
                  if (typeof v !== "number") return [String(v), name];
                  return name === "Vibration" ? [`${v.toFixed(2)} g`, name] : [`${v.toFixed(1)} °C`, name];
                }}
              />
              <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
              <Line yAxisId="temp" type="monotone" dataKey="temperature" name="Temperature" stroke={SERIES.temperature} strokeWidth={2} dot={false} activeDot={{ r: 3.5 }} />
              <Line yAxisId="vib"  type="monotone" dataKey="vibration"   name="Vibration"   stroke={SERIES.vibration}   strokeWidth={2} dot={false} activeDot={{ r: 3.5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
