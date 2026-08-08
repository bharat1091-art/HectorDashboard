import {
  BatteryMedium,
  BluetoothConnected,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gauge,
  MapPin,
  Navigation,
  Radio,
  Settings,
  Thermometer,
  Timer,
  Wifi,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TripRecord, VehicleData, WeatherData } from "@/types/dashboard";
import { WeatherModeHint } from "./WeatherEnvironment";

const VEHICLE_IMAGE = "https://api.builder.io/api/v1/image/assets/TEMP/9ce656fec5f9cdc32f1630019ab16c7d96149bfb?width=564";
const ROUTE_IMAGE = "https://api.builder.io/api/v1/image/assets/TEMP/298638ebdbb6a8002fa5f523597fdfcf13e8023d?width=2404";

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass-card dashboard-card ${className}`}>{children}</div>;
}

export function WeatherHeader({ weather, city, state, country, online, signalBars }: { weather: WeatherData; city: string; state: string; country: string; online: boolean; signalBars: number }) {
  return (
    <header className="weather-header">
      <div className="weather-summary">
        <div className="weather-symbol"><span className="cloud-back" /><span className="cloud-front" /><Zap className="weather-bolt" /></div>
        <div><div className="weather-condition">{weather.label}</div><div className="live-status"><span className={online ? "signal-live" : "signal-offline"}><Radio size={15} strokeWidth={3} /></span>{online ? "Live" : "Offline"}<WeatherModeHint condition={weather.condition} /></div></div>
      </div>
      <div className="location-summary"><MapPin size={38} className="location-icon" /><div><div className="city-name">{city}</div><div className="region-name">{state}, {country}</div></div></div>
      <div className="header-network"><Wifi size={16} /><span>{"▮".repeat(signalBars)}<span className="signal-empty">{"▮".repeat(4 - signalBars)}</span></span></div>
    </header>
  );
}

export function DistanceSection({ trip, vehicle, unit }: { trip: TripRecord; vehicle: VehicleData; unit: string }) {
  const value = unit === "mi" ? (trip.distanceKm * 0.621371).toFixed(1) : vehicle.distanceTraveledKm.toFixed(1);
  return <section className="distance-section"><div className="distance-metric"><div className="distance-value">{value}</div><div className="distance-unit">{unit}</div></div><div className="metric-separator" /><div className="speed-metric"><div className="metric-label">Avg</div><div className="speed-value">{trip.avgSpeedKph}</div><div className="speed-unit">km/h</div></div></section>;
}

export function RouteTracker({ progress }: { progress: number }) {
  const boundedProgress = Math.max(0, Math.min(100, progress));
  return <section className="route-tracker"><div className="route-visual"><img className="route-art" src={ROUTE_IMAGE} alt="Route progress with vehicle and flags" /><div className="route-completed" style={{ width: `${boundedProgress}%` }} /><div className="route-vehicle-motion" style={{ left: `${Math.max(9, Math.min(91, boundedProgress))}%` }}><img src={VEHICLE_IMAGE} alt="Vehicle" /><span className="vehicle-platform" /></div><div className="route-progress-value">{Math.round(boundedProgress)}%</div><div className="route-distance"><Navigation size={15} /> GPS</div></div></section>;
}

export function TripTimeSection({ duration }: { duration: string }) {
  return <section className="trip-time"><Timer size={45} /><span className="trip-time-label">Trip Time</span><span className="trip-time-colon">:</span><strong>{duration}</strong><span className="trip-time-unit">h</span></section>;
}

export function OutsideTemperatureCard({ temperature, unit }: { temperature: number; unit: string }) {
  return <GlassCard className="temperature-card"><div className="temp-layout"><div className="thermometer-art"><span className="thermometer-fill" /><span className="thermometer-bulb" /></div><div className="temp-value">{temperature}<sup>°{unit.toLowerCase()}</sup></div></div></GlassCard>;
}

export function TimeCard() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const meridiem = now.toLocaleTimeString([], { hour: "2-digit", hour12: true }).slice(-2);
  return <GlassCard className="time-card"><div className="time-value">{time}<sup>{meridiem}</sup></div></GlassCard>;
}

export function DateCard() {
  const now = new Date();
  return <GlassCard className="date-card"><div className="date-value">{now.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })}</div><div className="date-divider"><span /><strong>{now.toLocaleDateString([], { weekday: "long" })}</strong><span /></div><CalendarDays className="date-icon" size={16} /></GlassCard>;
}

export function CabinTemperatureCard({ temperature }: { temperature: number }) {
  return <GlassCard className="cabin-card"><img src={VEHICLE_IMAGE} alt="Vehicle" /><div className="cabin-overlay" /><div className="cabin-info"><div className="cabin-temp">{temperature}<sup>°c</sup></div></div></GlassCard>;
}

export function DashboardSidebar({ weather, vehicle, temperatureUnit }: { weather: WeatherData; vehicle: VehicleData; temperatureUnit: string }) {
  return <aside className="dashboard-sidebar"><OutsideTemperatureCard temperature={weather.temperatureC} unit={temperatureUnit} /><TimeCard /><DateCard /><CabinTemperatureCard temperature={vehicle.cabinTemperatureC} /></aside>;
}

export function BottomNavigation({ trip, onPrevious, onNext }: { trip: TripRecord; onPrevious: () => void; onNext: () => void }) {
  return <nav className="bottom-navigation"><button className="trip-arrow" onClick={onPrevious} aria-label="Previous trip"><ChevronLeft /></button><div className="trip-selector"><span>{trip.name}</span><span className="trip-dots"><i className="active" /><i /><i /></span></div><button className="trip-arrow" onClick={onNext} aria-label="Next trip"><ChevronRight /></button><div className="navigation-divider" /><Link className="settings-link" to="/settings"><Settings /><span>Settings</span></Link></nav>;
}

export function TelemetryStrip({ vehicle, connection }: { vehicle: VehicleData; connection: string }) {
  return <div className="telemetry-strip"><div><BluetoothConnected size={16} /><span>{connection === "connected" ? "OBD" : "OFFLINE"}</span></div><div><Zap size={16} /><span>{vehicle.batteryVoltage.toFixed(1)}V</span></div><div><BatteryMedium size={16} /><span>98%</span></div><div><Gauge size={16} /><span>{vehicle.speedKph} km/h</span></div></div>;
}
