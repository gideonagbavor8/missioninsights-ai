"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

interface TelemetryChartProps {
  data: TelemetryPoint[];
}

export default function TelemetryChart({
  data,
}: TelemetryChartProps) {
  const chartData = [...data]
    .reverse()
    .map((item) => ({
      time: new Date(item.recorded_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      battery: item.battery_level,
      fuel: item.fuel_level,
      temperature: item.temperature,
      signal: item.signal_strength,
      vibration: item.thruster_vibration,
    }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis
            yAxisId="left"
            domain={[0, 100]}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 1]}
          />

          <Tooltip />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="battery"
            name="Battery %"
            strokeWidth={2}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="fuel"
            name="Fuel %"
            strokeWidth={2}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            name="Temperature °C"
            strokeWidth={2}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="signal"
            name="Signal %"
            strokeWidth={2}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="vibration"
            name="Vibration g"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}