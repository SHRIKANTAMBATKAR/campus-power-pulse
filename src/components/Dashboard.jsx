import { useState, useEffect } from "react";
import { format } from "date-fns";
import { telemetryService } from "@/services/telemetryService";
import { HeaderStats } from "./HeaderStats";
import { SidebarNav } from "./SidebarNav";
import { LiveTelemetry } from "./LiveTelemetry";
import { ForecastCharts } from "./ForecastCharts";
import { OptimizerActions } from "./OptimizerActions";
import { AlertNotifications } from "./AlertNotifications";
import { ReportsSection } from "./ReportsSection";

export const Dashboard = () => {
  const [telemetryData, setTelemetryData] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    telemetryService.startSimulation();

    const unsubscribe = telemetryService.subscribe((data) => {
      setTelemetryData(data);
    });

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      unsubscribe();
      telemetryService.stopSimulation();
      clearInterval(timeInterval);
    };
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <LiveTelemetry data={telemetryData} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ForecastCharts />
              <OptimizerActions />
            </div>
          </div>
        );
      case "forecast":
        return <ForecastCharts expanded />;
      case "optimizer":
        return <OptimizerActions expanded />;
      case "reports":
        return <ReportsSection data={telemetryData} />;
      default:
        return (
          <div className="energy-card">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-muted-foreground">
              Configuration options coming soon...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-renewable">Campus VPP</h1>
            <p className="text-sm text-muted-foreground">
              Virtual Power Plant Management System
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {format(currentTime, "EEEE, MMMM do, yyyy")}
            </p>
            <p className="text-lg font-mono">
              {format(currentTime, "HH:mm:ss")}
            </p>
          </div>
        </div>
        {telemetryData && <HeaderStats data={telemetryData} />}
      </header>

      <div className="flex">
        <SidebarNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 p-6 max-w-[calc(100vw-250px)]">
          {renderActiveSection()}
        </main>
      </div>

      <AlertNotifications />
    </div>
  );
};
