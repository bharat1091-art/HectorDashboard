import { useEffect, useState } from "react";
import {
  BatteryCharging,
  BatteryMedium,
  BluetoothConnected,
  CarFront,
  CalendarDays,
  Flag,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Fuel,
  Gauge,
  MapPin,
  Radio,
  Settings,
  Thermometer,
  Timer,
  Zap,
  Wifi,
  Power,
} from "lucide-react";
import { Link } from "react-router-dom";
import { NetworkData, TimeFormat, TripRecord, VehicleData, WeatherCondition, WeatherData } from "@/types/dashboard";
import { WeatherModeHint } from "./WeatherEnvironment";

const VEHICLE_IMAGE = "https://api.builder.io/api/v1/image/assets/TEMP/9ce656fec5f9cdc32f1630019ab16c7d96149bfb?width=564";

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass-card dashboard-card ${className}`}>{children}</div>;
}

export function WeatherHeader({ weather, city, state, country, online }: { weather: WeatherData; city: string; state: string; country: string; online: boolean }) {
  return (
    <header className="weather-header">
      <div className="weather-summary">
        <div className="weather-symbol"><span className="cloud-back" /><span className="cloud-front" /><Zap className="weather-bolt" /></div>
        <div><div className="weather-condition">{weather.label}</div><div className="live-status"><span className={online ? "signal-live" : "signal-offline"}><Radio size={15} strokeWidth={3} /></span>{online ? "Live" : "Offline"}<WeatherModeHint condition={weather.condition} /></div></div>
      </div>
      <div className="location-summary"><MapPin size={38} className="location-icon" /><div><div className="city-name">{city}</div><div className="region-name">{state}, {country}</div></div></div>
    </header>
  );
}

export function DistanceSection({ trip, vehicle, unit }: { trip: TripRecord; vehicle: VehicleData; unit: string }) {
  const value = unit === "mi" ? (trip.distanceKm * 0.621371).toFixed(1) : vehicle.distanceTraveledKm.toFixed(1);
  return <section className="distance-section"><div className="distance-metric"><div className="distance-value">{value}</div><div className="distance-unit">{unit.toUpperCase()}</div></div><div className="metric-separator" /><div className="speed-metric"><div className="metric-label">Avg</div><div className="speed-value">{trip.avgSpeedKph}</div><div className="speed-unit">KM/H</div></div></section>;
}

export function RouteTracker({ progress }: { progress: number }) {
  const boundedProgress = Math.max(0, Math.min(100, progress));
  return <section className="route-tracker"><div className="route-visual"><div className="route-grid" /><div className="route-track"><div className="route-track-remaining" /><div className="route-track-completed" style={{ width: `${boundedProgress}%` }} /><div className="route-segments">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div></div><div className="route-flag route-start"><Flag size={31} /><span /></div><div className="route-flag route-end"><Flag size={31} /><span /></div><div className="route-vehicle-motion" style={{ left: `${8 + boundedProgress * 0.84}%` }}><span className="vehicle-platform" /><img src={VEHICLE_IMAGE} alt="Vehicle" /></div></div></section>;
}

export function TripTimeSection({ duration }: { duration: string }) {
  return <section className="trip-time"><Timer size={45} /><span className="trip-time-label">Trip Time</span><span className="trip-time-colon">:</span><strong>{duration}</strong><span className="trip-time-unit">h</span></section>;
}

export function WeatherAdvisory({ condition }: { condition: WeatherCondition }) {
  const advisory = condition === "thunderstorm" ? "Thunderstorm Warning" : condition === "rain" || condition === "drizzle" ? "Heavy Rain Expected" : condition === "fog" || condition === "mist" ? "Fog Advisory Active" : condition === "snow" ? "Snowfall Warning" : condition === "clear-day" || condition === "clear-night" ? "Clear Visibility Conditions" : "Road Conditions Normal";
  return <div className="weather-advisory"><span />{advisory}</div>;
}

export function VehicleMetricsPanel({ vehicle, duration }: { vehicle: VehicleData; duration: string }) {
  const [frontLeft, frontRight, rearLeft, rearRight] = vehicle.tirePressurePsi;
  return <section className="vehicle-metrics-panel"><div className="metrics-cell metrics-trip-time"><Timer size={26} /><span className="metrics-label">Trip Time</span><strong>{duration}</strong><em>h</em></div><div className="metrics-cell fuel-metric"><span className="metrics-label">FUEL</span><Fuel size={25} /><strong>{vehicle.fuelPercent}%</strong><div className="fuel-bar"><i style={{ width: `${vehicle.fuelPercent}%` }} /></div><small>E</small><small>F</small></div><div className="metrics-cell range-metric"><span className="metrics-label">RANGE</span><Gauge size={25} /><strong>{vehicle.rangeKm}</strong><em>KM</em></div><div className="metrics-cell engine-metric"><span className="metrics-label">ENGINE TEMP</span><Thermometer size={25} /><strong>{vehicle.engineTemperatureC}°C</strong><i className="engine-temp-status" /></div><div className="metrics-cell tpms-metric"><span className="metrics-label">TIRE PRESSURE (TPMS)</span><div className="tpms-visual"><span className="tpms-front-left">{frontLeft}<small>PSI</small><i className="tpms-connector" /></span><span className="tpms-front-right">{frontRight}<small>PSI</small><i className="tpms-connector" /></span><span className="tpms-rear-left">{rearLeft}<small>PSI</small><i className="tpms-connector" /></span><span className="tpms-rear-right">{rearRight}<small>PSI</small><i className="tpms-connector" /></span><CarFront size={72} /></div></div></section>;
}

export function VehicleStatusStrip({ vehicle, connection, network }: { vehicle: VehicleData; connection: string; network: NetworkData }) {
  return <div className="vehicle-status-strip"><span><Power size={23} /> <b>IGNITION</b> {vehicle.ignitionOn ? "ON" : "OFF"}</span><span><BatteryCharging size={23} /> <b>BATTERY</b> {vehicle.batteryVoltage.toFixed(1)} V <small>CHARGING</small></span><span><BluetoothConnected size={23} /> <b>BT OBD</b> {connection === "connected" ? "CONNECTED" : "DISCONNECTED"}</span><span><Wifi size={23} /> <b>NETWORK</b> <i className={`signal-bars bars-${network.signalBars}`} /> {network.connectivityType === "cellular" ? "4G" : network.online ? "4G" : "OFFLINE"}</span></div>;
}

export function OutsideTemperatureCard({ temperature, unit }: { temperature: number; unit: string }) {
  return <GlassCard className="temperature-card"><div className="temp-layout"><div className="thermometer-art"><span className="thermometer-fill" /><span className="thermometer-bulb" /></div><div className="temp-value">{temperature}<sup>°{unit.toUpperCase()}</sup></div></div></GlassCard>;
}

export function TimeCard({ format }: { format: TimeFormat }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const now = new Date();
  const localizedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: format === "12h" });
  const time = format === "12h" ? localizedTime.replace(/\s?(AM|PM)$/i, "") : localizedTime;
  const meridiem = now.toLocaleTimeString([], { hour: "2-digit", hour12: true }).slice(-2).toUpperCase();
  return <GlassCard className="time-card"><div className="time-value">{time}{format === "12h" && <span className="time-meridiem">{meridiem}</span>}</div></GlassCard>;
}

export function DateCard() {
  const now = new Date();
  return <GlassCard className="date-card"><div className="date-value">{now.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })}</div><div className="date-divider"><span /><strong>{now.toLocaleDateString([], { weekday: "long" })}</strong><span /></div><CalendarDays className="date-icon" size={16} /></GlassCard>;
}

export function CabinTemperatureCard({ temperature }: { temperature: number }) {
  return <GlassCard className="cabin-card"><img src={VEHICLE_IMAGE} alt="Vehicle" /><div className="cabin-overlay" /><div className="cabin-info"><div className="cabin-temp">{temperature}<sup>°C</sup></div></div></GlassCard>;
}

export function DashboardSidebar({ weather, vehicle, temperatureUnit, timeFormat }: { weather: WeatherData; vehicle: VehicleData; temperatureUnit: string; timeFormat: TimeFormat }) {
  return <aside className="dashboard-sidebar"><OutsideTemperatureCard temperature={weather.temperatureC} unit={temperatureUnit} /><TimeCard format={timeFormat} /><DateCard /><CabinTemperatureCard temperature={vehicle.cabinTemperatureC} /></aside>;
}

export function BottomNavigation({ trip, onPrevious, onNext }: { trip: TripRecord; onPrevious: () => void; onNext: () => void }) {
  return <nav className="bottom-navigation"><button className="trip-arrow" onClick={onPrevious} aria-label="Previous trip"><ChevronLeft /></button><div className="trip-selector"><span>{trip.name}</span><span className="trip-dots"><i className="active" /><i /><i /></span></div><button className="trip-arrow" onClick={onNext} aria-label="Next trip"><ChevronRight /></button><div className="navigation-divider" /><Link className="settings-link" to="/settings"><Settings /><span>Settings</span></Link></nav>;
}

export function TelemetryStrip({ vehicle, connection }: { vehicle: VehicleData; connection: string }) {
  return <div className="telemetry-strip"><div><BluetoothConnected size={16} /><span>{connection === "connected" ? "OBD" : "OFFLINE"}</span></div><div><Zap size={16} /><span>{vehicle.batteryVoltage.toFixed(1)}V</span></div><div><BatteryMedium size={16} /><span>98%</span></div><div><Gauge size={16} /><span>{vehicle.speedKph} km/h</span></div></div>;
}
