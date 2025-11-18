import { useState, useEffect } from "react";
import { telemetryService } from "@/services/telemetryService";
import {
  Zap,
  Battery,
  Thermometer,
  RotateCcw,
  TrendingDown,
  Clock,
  DollarSign,
  Leaf,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const OptimizerActions = ({ expanded = false }) => {
  const [actions, setActions] = useState([]);
  const [executingActions, setExecutingActions] = useState(new Set());

  useEffect(() => {
    const optimizerActions = telemetryService.generateOptimizerActions();
    setActions(optimizerActions);
  }, []);

  const getActionIcon = (type) => {
    switch (type) {
      case "battery":
        return Battery;
      case "hvac":
        return Thermometer;
      case "load_shift":
        return RotateCcw;
      default:
        return Zap;
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case "battery":
        return "text-battery";
      case "hvac":
        return "text-accent";
      case "load_shift":
        return "text-grid";
      default:
        return "text-primary";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-destructive bg-destructive/10";
      case "medium":
        return "text-warning bg-warning/10";
      case "low":
        return "text-muted-foreground bg-muted";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-renewable bg-renewable/10";
      case "completed":
        return "text-muted-foreground bg-muted";
      case "pending":
        return "text-warning bg-warning/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const executeAction = (actionId) => {
    setExecutingActions((prev) => new Set(prev).add(actionId));

    setTimeout(() => {
      setActions((prev) =>
        prev.map((action) =>
          action.id === actionId ? { ...action, status: "active" } : action
        )
      );
      setExecutingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }, 2000);
  };

  const totalImpact = actions.reduce(
    (acc, action) => ({
      gridReduction: acc.gridReduction + action.impact.gridReduction,
      costSaving: acc.costSaving + action.impact.costSaving,
      co2Reduction: acc.co2Reduction + action.impact.co2Reduction,
    }),
    { gridReduction: 0, costSaving: 0, co2Reduction: 0 }
  );

  return (
    <div className={`energy-card ${expanded ? "col-span-full" : ""}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Optimizer Actions</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered energy optimization recommendations
            </p>
          </div>
        </div>
        {expanded && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Total Potential Impact
            </p>
            <div className="flex gap-4 mt-1">
              <span className="text-sm font-medium text-renewable">
                {totalImpact.gridReduction} kW saved
              </span>
              <span className="text-sm font-medium text-warning">
                ${totalImpact.costSaving} saved
              </span>
              <span className="text-sm font-medium text-renewable">
                {totalImpact.co2Reduction} kg CO₂
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className={`space-y-4 ${
          expanded ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""
        }`}
      >
        {actions.map((action) => {
          const Icon = getActionIcon(action.type);
          const isExecuting = executingActions.has(action.id);

          return (
            <div
              key={action.id}
              className="bg-secondary/50 border border-border rounded-lg p-4 hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-card">
                    <Icon
                      className={`w-4 h-4 ${getActionColor(action.type)}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{action.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                          action.priority
                        )}`}
                      >
                        {action.priority.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          action.status
                        )}`}
                      >
                        {action.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                {action.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => executeAction(action.id)}
                    disabled={isExecuting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isExecuting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {action.description}
              </p>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>{action.timeWindow}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="w-3 h-3 text-renewable" />
                    <span className="text-xs text-muted-foreground">Grid</span>
                  </div>
                  <p className="text-sm font-medium text-renewable">
                    -{action.impact.gridReduction} kW
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="w-3 h-3 text-warning" />
                    <span className="text-xs text-muted-foreground">Cost</span>
                  </div>
                  <p className="text-sm font-medium text-warning">
                    ${action.impact.costSaving}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Leaf className="w-3 h-3 text-renewable" />
                    <span className="text-xs text-muted-foreground">CO₂</span>
                  </div>
                  <p className="text-sm font-medium text-renewable">
                    -{action.impact.co2Reduction} kg
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
