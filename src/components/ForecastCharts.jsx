import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { telemetryService } from "@/services/telemetryService";
import { TrendingUp, Sun, Wind, Home } from "lucide-react";

export const ForecastCharts = ({ expanded = false }) => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const data = telemetryService.generateForecastData();
    setForecastData(data);

    const interval = setInterval(() => {
      const newData = telemetryService.generateForecastData();
      setForecastData(newData);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value} ${
                entry.dataKey === "price" ? "$/kWh" : "kW"
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartHeight = expanded ? 400 : 300;

  return (
    <div className={`energy-card ${expanded ? "col-span-full" : ""}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">24-Hour Forecast</h3>
          <p className="text-sm text-muted-foreground">
            Prediction confidence: 85-95%
          </p>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="text-lg font-medium flex items-center gap-2">
              <Sun className="w-4 h-4 text-renewable" />
              <Wind className="w-4 h-4 text-wind ml-2" />
              Generation Forecast
            </h4>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={forecastData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="timestamp"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="solar.value"
                  name="Solar"
                  stackId="1"
                  stroke="hsl(var(--renewable))"
                  fill="hsl(var(--renewable) / 0.3)"
                />
                <Area
                  type="monotone"
                  dataKey="wind.value"
                  name="Wind"
                  stackId="1"
                  stroke="hsl(var(--wind))"
                  fill="hsl(var(--wind) / 0.3)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium flex items-center gap-2">
              <Home className="w-4 h-4 text-muted-foreground" />
              Load & Price Forecast
            </h4>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={forecastData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="timestamp"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="load.value"
                  name="Load (kW)"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="price.value"
                  name="Price ($/kWh)"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!expanded && (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={forecastData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="timestamp"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="solar.value"
              name="Solar"
              stackId="1"
              stroke="hsl(var(--renewable))"
              fill="hsl(var(--renewable) / 0.3)"
            />
            <Area
              type="monotone"
              dataKey="wind.value"
              name="Wind"
              stackId="1"
              stroke="hsl(var(--wind))"
              fill="hsl(var(--wind) / 0.3)"
            />
            <Line
              type="monotone"
              dataKey="load.value"
              name="Load"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
