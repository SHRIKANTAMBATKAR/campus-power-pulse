import { format } from 'date-fns';

class TelemetryService {
  constructor() {
    this.simulationInterval = null;
    this.callbacks = [];
    this.alertCallbacks = [];
  }

  // Simulate realistic energy patterns
  getTimeBasedMultiplier() {
    const hour = new Date().getHours();
    // Solar peak around noon, wind variable, load peaks morning/evening
    if (hour >= 10 && hour <= 14) return 1.2; // Peak solar
    if (hour >= 6 && hour <= 9) return 0.8;   // Morning
    if (hour >= 17 && hour <= 21) return 0.9; // Evening
    return 0.6; // Night
  }

  generateTelemetryData() {
    const timeMultiplier = this.getTimeBasedMultiplier();
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour <= 18;

    // Solar generation (day/night cycle with some randomness)
    const solarBase = isDay ? 150 + Math.sin((hour - 6) / 12 * Math.PI) * 100 : 0;
    const solar = Math.max(0, solarBase * (0.8 + Math.random() * 0.4) * timeMultiplier);

    // Wind generation (more variable)
    const wind = 50 + Math.random() * 80 * (0.7 + Math.random() * 0.6);

    // Battery simulation
    const batterySOC = 30 + Math.random() * 60;
    const batteryPower = (Math.random() - 0.5) * 100; // Can charge or discharge

    // Grid interaction
    const totalGeneration = solar + wind;
    const totalLoad = 80 + Math.random() * 120 * timeMultiplier;
    const gridImport = Math.max(0, totalLoad - totalGeneration - batteryPower);
    const gridExport = Math.max(0, totalGeneration - totalLoad + batteryPower);

    return {
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      solar: {
        power: Math.round(solar * 10) / 10,
        daily: Math.round((solar * 24 * 0.6) * 10) / 10,
        efficiency: Math.round((85 + Math.random() * 10) * 10) / 10
      },
      wind: {
        power: Math.round(wind * 10) / 10,
        daily: Math.round((wind * 24 * 0.8) * 10) / 10,
        speed: Math.round((5 + Math.random() * 15) * 10) / 10
      },
      battery: {
        soc: Math.round(batterySOC * 10) / 10,
        power: Math.round(batteryPower * 10) / 10,
        capacity: 500,
        status: batteryPower > 5 ? 'charging' : batteryPower < -5 ? 'discharging' : 'idle'
      },
      grid: {
        import: Math.round(gridImport * 10) / 10,
        export: Math.round(gridExport * 10) / 10,
        frequency: Math.round((50.0 + (Math.random() - 0.5) * 0.2) * 100) / 100,
        voltage: Math.round((230 + (Math.random() - 0.5) * 10) * 10) / 10
      },
      load: {
        total: Math.round(totalLoad * 10) / 10,
        hvac: Math.round(totalLoad * 0.4 * 10) / 10,
        lighting: Math.round(totalLoad * 0.2 * 10) / 10,
        other: Math.round(totalLoad * 0.4 * 10) / 10
      },
      weather: {
        temperature: Math.round((20 + Math.random() * 15) * 10) / 10,
        humidity: Math.round((40 + Math.random() * 40) * 10) / 10,
        cloudCover: Math.round((Math.random() * 100) * 10) / 10,
        windSpeed: Math.round((3 + Math.random() * 12) * 10) / 10
      },
      kpis: {
        co2Saved: Math.round(((solar + wind) * 0.45) * 10) / 10, // kg CO2 per hour
        costSaved: Math.round(((solar + wind) * 0.12) * 100) / 100, // $ per hour
        efficiency: Math.round((92 + Math.random() * 6) * 10) / 10,
        uptime: Math.round((98 + Math.random() * 2) * 10) / 10
      }
    };
  }

  generateForecastData() {
    const forecast = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();
      const isDay = hour >= 6 && hour <= 18;

      // Solar forecast with confidence bands
      const solarBase = isDay ? 150 + Math.sin((hour - 6) / 12 * Math.PI) * 120 : 0;
      const solar = Math.max(0, solarBase * (0.9 + Math.random() * 0.2));

      // Wind forecast (less predictable)
      const wind = 40 + Math.random() * 90;

      // Load forecast
      const loadMultiplier = hour >= 6 && hour <= 9 || hour >= 17 && hour <= 21 ? 1.3 :
                           hour >= 10 && hour <= 16 ? 1.0 :
                           0.7;
      const load = (80 + Math.random() * 60) * loadMultiplier;

      // Price forecast (higher during peak hours)
      const price = hour >= 17 && hour <= 21 ? 0.25 + Math.random() * 0.15 :
                   hour >= 10 && hour <= 16 ? 0.15 + Math.random() * 0.1 :
                   0.08 + Math.random() * 0.07;

      forecast.push({
        timestamp: format(time, 'HH:mm'),
        solar: { value: Math.round(solar * 10) / 10, confidence: 85 + Math.random() * 10 },
        wind: { value: Math.round(wind * 10) / 10, confidence: 70 + Math.random() * 15 },
        load: { value: Math.round(load * 10) / 10, confidence: 90 + Math.random() * 8 },
        price: { value: Math.round(price * 1000) / 1000, confidence: 80 + Math.random() * 15 }
      });
    }

    return forecast;
  }

  generateOptimizerActions() {
    return [
      {
        id: '1',
        type: 'battery',
        title: 'Charge Battery During Low Rates',
        description: 'Charge battery from 1-3 PM when solar generation peaks',
        timeWindow: '13:00 - 15:00',
        impact: {
          gridReduction: 45,
          costSaving: 12.5,
          co2Reduction: 8.2
        },
        status: 'pending',
        priority: 'high'
      },
      {
        id: '2',
        type: 'hvac',
        title: 'Pre-cool Buildings',
        description: 'Lower HVAC setpoint before peak hours to reduce afternoon load',
        timeWindow: '14:00 - 16:00',
        impact: {
          gridReduction: 32,
          costSaving: 8.7,
          co2Reduction: 5.4
        },
        status: 'pending',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'load_shift',
        title: 'Shift Non-Critical Loads',
        description: 'Delay water heating and EV charging to off-peak hours',
        timeWindow: '22:00 - 06:00',
        impact: {
          gridReduction: 28,
          costSaving: 15.3,
          co2Reduction: 6.8
        },
        status: 'active',
        priority: 'medium'
      }
    ];
  }

  startSimulation() {
    if (this.simulationInterval) return;

    // Send initial data
    const initialData = this.generateTelemetryData();
    this.callbacks.forEach(callback => callback(initialData));

    // Check for alerts
    this.checkForAlerts(initialData);

    // Update every 15 seconds
    this.simulationInterval = window.setInterval(() => {
      const data = this.generateTelemetryData();
      this.callbacks.forEach(callback => callback(data));
      this.checkForAlerts(data);
    }, 15000);
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  subscribe(callback) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  subscribeToAlerts(callback) {
    this.alertCallbacks.push(callback);
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  checkForAlerts(data) {
    const alerts = [];

    // Battery low alert
    if (data.battery.soc < 20) {
      alerts.push({
        id: `battery-low-${Date.now()}`,
        type: 'warning',
        title: 'Low Battery Level',
        message: `Battery SOC is ${data.battery.soc}%. Consider charging soon.`,
        timestamp: data.timestamp,
        acknowledged: false
      });
    }

    // High grid import alert
    if (data.grid.import > 150) {
      alerts.push({
        id: `grid-high-${Date.now()}`,
        type: 'warning',
        title: 'High Grid Import',
        message: `Grid import is ${data.grid.import} kW. Consider load reduction.`,
        timestamp: data.timestamp,
        acknowledged: false
      });
    }

    // System efficiency alert
    if (data.kpis.efficiency < 85) {
      alerts.push({
        id: `efficiency-low-${Date.now()}`,
        type: 'info',
        title: 'System Efficiency Alert',
        message: `System efficiency is ${data.kpis.efficiency}%. Check for maintenance needs.`,
        timestamp: data.timestamp,
        acknowledged: false
      });
    }

    alerts.forEach(alert => {
      this.alertCallbacks.forEach(callback => callback(alert));
    });
  }
}

export const telemetryService = new TelemetryService();
