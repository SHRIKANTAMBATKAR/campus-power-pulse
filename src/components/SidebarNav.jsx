import {
  BarChart3,
  TrendingUp,
  Zap,
  FileBarChart,
  Settings,
  Activity,
} from "lucide-react";

export const SidebarNav = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "forecast", label: "Forecast", icon: TrendingUp },
    { id: "optimizer", label: "Optimizer", icon: Zap },
    { id: "reports", label: "Reports", icon: FileBarChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="w-64 bg-sidebar border-r border-sidebar-border h-[calc(100vh-120px)] p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === "dashboard" && (
                <div className="ml-auto">
                  <div className="status-indicator status-online" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-sidebar-accent rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-renewable" />
          <span className="text-sm font-medium text-sidebar-foreground">
            System Status
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-sidebar-foreground">Uptime</span>
            <span className="text-renewable font-medium">99.8%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sidebar-foreground">Efficiency</span>
            <span className="text-renewable font-medium">94.2%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sidebar-foreground">Last Update</span>
            <span className="text-sidebar-foreground">15s ago</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
