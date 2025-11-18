export const HeaderStats = ({ data }) => {
  const stats = [
    {
      label: "Solar Generation",
      value: `${data.solar.power} kW`,
      color: "text-renewable",
      bgColor: "bg-renewable/10",
    },
    {
      label: "Wind Generation",
      value: `${data.wind.power} kW`,
      color: "text-wind",
      bgColor: "bg-wind/10",
    },
    {
      label: "Battery SOC",
      value: `${data.battery.soc}%`,
      color: "text-battery",
      bgColor: "bg-battery/10",
    },
    {
      label: "Grid Import",
      value: `${data.grid.import} kW`,
      color: "text-grid",
      bgColor: "bg-grid/10",
    },
    {
      label: "CO₂ Saved Today",
      value: `${(data.kpis.co2Saved * 24).toFixed(1)} kg`,
      color: "text-renewable",
      bgColor: "bg-renewable/10",
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-lg p-3 text-center border border-border`}
        >
          <p className="text-xs text-muted-foreground font-medium">
            {stat.label}
          </p>
          <p className={`text-lg font-bold ${stat.color} mt-1`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};
