import {
  Sun,
  Wind,
  Battery,
  Zap,
  Home,
  Thermometer,
  Droplets,
  Gauge,
} from "lucide-react";

export const LiveTelemetry = ({ data }) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="energy-card animate-pulse">
            <div className="h-24 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const telemetryCards = [
    {
      title: "Solar Generation",
      value: `${data.solar.power} kW`,
      subtitle: `Daily: ${data.solar.daily} kWh`,
      icon: Sun,
      color: "text-renewable",
      bgGradient: "gradient-renewable",
      status: data.solar.power > 0 ? "online" : "offline",
    },
    {
      title: "Wind Generation",
      value: `${data.wind.power} kW`,
      subtitle: `Speed: ${data.wind.speed} m/s`,
      icon: Wind,
      color: "text-wind",
      bgGradient: "gradient-wind",
      status: "online",
    },
    {
      title: "Battery Storage",
      value: `${data.battery.soc}%`,
      subtitle: `${
        data.battery.power > 0
          ? "Charging"
          : data.battery.power < 0
          ? "Discharging"
          : "Idle"
      } (${Math.abs(data.battery.power)} kW)`,
      icon: Battery,
      color: "text-battery",
      bgGradient: "gradient-battery",
      status: data.battery.soc > 20 ? "online" : "warning",
    },
    {
      title: "Grid Connection",
      value:
        data.grid.import > 0
          ? `↓ ${data.grid.import} kW`
          : `↑ ${data.grid.export} kW`,
      subtitle: `${data.grid.frequency} Hz | ${data.grid.voltage} V`,
      icon: Zap,
      color: "text-grid",
      bgGradient: "gradient-grid",
      status: "online",
    },
    {
      title: "Campus Load",
      value: `${data.load.total} kW`,
      subtitle: `HVAC: ${data.load.hvac} kW`,
      icon: Home,
      color: "text-foreground",
      bgGradient: "bg-muted",
      status: "online",
    },
    {
      title: "Temperature",
      value: `${data.weather.temperature}°C`,
      subtitle: `Humidity: ${data.weather.humidity}%`,
      icon: Thermometer,
      color: "text-accent",
      bgGradient: "bg-accent/10",
      status: "online",
    },
    {
      title: "System Efficiency",
      value: `${data.kpis.efficiency}%`,
      subtitle: `Uptime: ${data.kpis.uptime}%`,
      icon: Gauge,
      color: "text-renewable",
      bgGradient: "bg-renewable/10",
      status: data.kpis.efficiency > 90 ? "online" : "warning",
    },
    {
      title: "Environmental Impact",
      value: `${data.kpis.co2Saved} kg/h`,
      subtitle: `Cost saved: $${data.kpis.costSaved}/h`,
      icon: Droplets,
      color: "text-renewable",
      bgGradient: "bg-renewable/10",
      status: "online",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Live Telemetry</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="status-indicator status-online" />
          <span>Live • Updated {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {telemetryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="energy-card group hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgGradient}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className={`status-indicator status-${card.status}`} />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </h3>
                <p
                  className={`text-2xl font-bold ${card.color} group-hover:scale-105 transition-transform`}
                >
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
