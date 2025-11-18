import { useState } from "react";
import { FileBarChart, Download, TrendingUp, Zap, DollarSign, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const ReportsSection = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("day");

  const historicalData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(
      Date.now() - (29 - i) * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    solar: 120 + Math.random() * 80,
    wind: 60 + Math.random() * 40,
    gridImport: 80 + Math.random() * 60,
    costSaved: 15 + Math.random() * 20,
    co2Saved: 25 + Math.random() * 15,
  }));

  const energyMixData = [
    { name: "Solar", value: 45, color: "hsl(var(--renewable))" },
    { name: "Wind", value: 25, color: "hsl(var(--wind))" },
    { name: "Grid", value: 30, color: "hsl(var(--grid))" },
  ];

  const generateReport = (format) => {
    const reportData = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      summary: {
        totalGeneration: data ? data.solar.power + data.wind.power : 0,
        gridImport: data?.grid.import || 0,
        co2Saved: data?.kpis.co2Saved || 0,
        costSaved: data?.kpis.costSaved || 0,
      },
      historical: historicalData,
    };

    if (format === "csv") {
      const csvContent = [
        [
          "Date",
          "Solar (kW)",
          "Wind (kW)",
          "Grid Import (kW)",
          "Cost Saved ($)",
          "CO2 Saved (kg)",
        ],
        ...historicalData.map((row) => [
          row.date,
          row.solar.toFixed(1),
          row.wind.toFixed(1),
          row.gridImport.toFixed(1),
          row.costSaved.toFixed(2),
          row.co2Saved.toFixed(1),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campus-vpp-report-${selectedPeriod}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const pdfContent = `Campus VPP Report - ${selectedPeriod.toUpperCase()}
Generated: ${new Date().toLocaleString()}

SUMMARY
Total Generation: ${reportData.summary.totalGeneration.toFixed(1)} kW
Grid Import: ${reportData.summary.gridImport.toFixed(1)} kW
CO2 Saved: ${reportData.summary.co2Saved.toFixed(1)} kg/h
Cost Saved: $${reportData.summary.costSaved.toFixed(2)}/h

HISTORICAL DATA (Last 30 Days)
${historicalData
        .map(
          (row) =>
            `${row.date}: Solar ${row.solar.toFixed(
              1
            )}kW, Wind ${row.wind.toFixed(1)}kW, Grid ${row.gridImport.toFixed(
              1
            )}kW`
        )
        .join("\n")}`;

      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campus-vpp-report-${selectedPeriod}-${
        new Date().toISOString().split("T")[0]
      }.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const kpiCards = [
    {
      title: "Total Generation",
      value: data
        ? `${(data.solar.power + data.wind.power).toFixed(1)} kW`
        : "0 kW",
      change: "+12.5%",
      icon: Zap,
      color: "text-renewable",
    },
    {
      title: "Cost Savings",
      value: data ? `$${(data.kpis.costSaved * 24).toFixed(0)}` : "$0",
      change: "+8.3%",
      icon: DollarSign,
      color: "text-warning",
    },
    {
      title: "CO₂ Reduction",
      value: data ? `${(data.kpis.co2Saved * 24).toFixed(0)} kg` : "0 kg",
      change: "+15.2%",
      icon: Leaf,
      color: "text-renewable",
    },
    {
      title: "Grid Independence",
      value: data
        ? `${Math.max(
            0,
            100 -
              (data.grid.import /
                (data.solar.power + data.wind.power + data.grid.import)) *
                100
          ).toFixed(1)}%`
        : "0%",
      change: "+5.7%",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <FileBarChart className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Performance metrics and export capabilities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1">
            {["day", "week", "month"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-background"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateReport("csv")}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button
              size="sm"
              onClick={() => generateReport("pdf")}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              PDF Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="energy-card">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <span className="text-sm text-renewable font-medium">
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {kpi.title}
              </h3>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="energy-card">
          <h3 className="text-lg font-semibold mb-4">
            Historical Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historicalData.slice(-14)}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="solar" name="Solar" fill="hsl(var(--renewable))" />
              <Bar dataKey="wind" name="Wind" fill="hsl(var(--wind))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="energy-card">
          <h3 className="text-lg font-semibold mb-4">Energy Mix</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={energyMixData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {energyMixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
