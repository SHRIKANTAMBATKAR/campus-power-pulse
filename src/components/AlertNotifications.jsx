import { useState, useEffect } from "react";
import { telemetryService } from "@/services/telemetryService";
import { AlertTriangle, Info, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AlertNotifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    const unsubscribe = telemetryService.subscribeToAlerts((alert) => {
      setAlerts((prev) => [alert, ...prev.slice(0, 9)]);

      setVisibleAlerts((prev) => [alert, ...prev]);

      setTimeout(() => {
        setVisibleAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      }, 10000);
    });

    return unsubscribe;
  }, []);

  const dismissAlert = (alertId) => {
    setVisibleAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "error":
        return AlertTriangle;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      default:
        return Bell;
    }
  };

  const getAlertColors = (type) => {
    switch (type) {
      case "error":
        return {
          bg: "bg-destructive/10 border-destructive/20",
          icon: "text-destructive",
          text: "text-destructive",
        };
      case "warning":
        return {
          bg: "bg-warning/10 border-warning/20",
          icon: "text-warning",
          text: "text-warning",
        };
      case "info":
        return {
          bg: "bg-accent/10 border-accent/20",
          icon: "text-accent",
          text: "text-accent",
        };
      default:
        return {
          bg: "bg-muted border-border",
          icon: "text-muted-foreground",
          text: "text-foreground",
        };
    }
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleAlerts.slice(0, 3).map((alert) => {
        const Icon = getAlertIcon(alert.type);
        const colors = getAlertColors(alert.type);

        return (
          <div
            key={alert.id}
            className={`${colors.bg} border rounded-lg p-4 shadow-lg animate-fade-in backdrop-blur-sm`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${colors.icon}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${colors.text} mb-1`}>
                  {alert.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.id)}
                className="h-6 w-6 p-0 hover:bg-background/50"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
      })}

      {visibleAlerts.length > 3 && (
        <div className="bg-muted border border-border rounded-lg p-2 text-center">
          <p className="text-xs text-muted-foreground">
            +{visibleAlerts.length - 3} more alerts
          </p>
        </div>
      )}
    </div>
  );
};
