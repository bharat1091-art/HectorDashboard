import { useEffect, useState } from "react";
import {
  BatteryCharging,
  BatteryMedium,
  BluetoothConnected,
  CalendarDays,
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
const TPMS_VEHICLE_IMAGE = "https://api.builder.io/api/v1/image/assets/TEMP/275f4f1db4f184507a2b5e69ea8b6f5d019a6e70?width=2048";
const ROUTE_SUV_IMAGE = "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2Fc470458ce33e40e4a75a024aebcc1526?format=webp&width=800&height=1200";
const ROUTE_START_FLAG_IMAGE = "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2F215989aed87a421fa6a4c89a53bad44c?format=webp&width=800&height=1200";
const ROUTE_END_FLAG_IMAGE = "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2Fda051640402c4f9bad76bb7dc330c767?format=webp&width=800&height=1200";

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
  return <section className="route-tracker"><div className="route-visual"><svg className="route-energy-svg" viewBox="0 0 1000 190" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="route-energy-gradient" x1="0" x2="1"><stop offset="0" stopColor="#00BFFF" /><stop offset="1" stopColor="#00FFFF" /></linearGradient><filter id="route-energy-glow" x="-30%" y="-300%" width="160%" height="700%"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs><path className="route-energy-base" d="M70 112 H930" /><path className="route-energy-completed" d="M70 112 H930" pathLength="100" style={{ strokeDasharray: `${boundedProgress} ${100 - boundedProgress}` }} /><path className="route-energy-flow route-energy-flow-one" d="M930 112 H70" /><path className="route-energy-flow route-energy-flow-two" d="M930 112 H70" /><path className="route-energy-pulse" d="M70 112 H930" /><path className="route-energy-platform" d="M370 147 H630 Q650 147 650 159 Q650 171 630 171 H370 Q350 171 350 159 Q350 147 370 147 Z" /><path className="route-energy-arrow route-energy-arrow-one" d="M280 103 l18 9 -18 9" /><path className="route-energy-arrow route-energy-arrow-two" d="M520 103 l18 9 -18 9" /><path className="route-energy-arrow route-energy-arrow-three" d="M760 103 l18 9 -18 9" /></svg><div className="route-flag route-start"><img src={ROUTE_START_FLAG_IMAGE} alt="Start" /></div><div className="route-flag route-end"><img src={ROUTE_END_FLAG_IMAGE} alt="Destination" /></div><div className="route-vehicle-motion" style={{ left: `${8 + boundedProgress * 0.84}%` }}><img src={ROUTE_SUV_IMAGE} alt="Vehicle" /></div></div></section>;
}

export function TripTimeSection({ duration }: { duration: string }) {
  return <section className="trip-time"><Timer size={45} /><span className="trip-time-label">Trip Time</span><span className="trip-time-colon">:</span><strong>{duration}</strong><span className="trip-time-unit">h</span></section>;
}

export function WeatherAdvisory({ condition }: { condition: WeatherCondition }) {
  const advisory = condition === "thunderstorm" ? "Thunderstorm Warning" : condition === "rain" || condition === "drizzle" ? "Heavy Rain Expected" : condition === "fog" || condition === "mist" ? "Fog Advisory Active" : condition === "snow" ? "Snowfall Warning" : condition === "clear-day" || condition === "clear-night" ? "Clear Visibility Conditions" : "Road Conditions Normal";
  return <div className="weather-advisory"><span />{advisory}</div>;
}

export function VehicleMetricsPanel({ vehicle, duration }: { vehicle: VehicleData; duration: string }) {
  return <section className="vehicle-metrics-panel"><div className="metrics-cell metrics-trip-time"><div className="metrics-heading"><Timer size={26} /><span className="metrics-label">Trip Time</span></div><div className="metrics-reading"><strong>{duration}</strong><em>h</em></div></div><div className="metrics-cell fuel-metric"><span className="metrics-label">FUEL</span><div className="metrics-reading"><Fuel size={25} /><strong>{vehicle.fuelPercent}%</strong></div><div className="fuel-bar"><i style={{ width: `${vehicle.fuelPercent}%` }} /></div><div className="fuel-scale"><small>E</small><small>F</small></div></div><div className="metrics-cell range-metric"><span className="metrics-label">RANGE</span><div className="metrics-reading metrics-stacked-reading"><Gauge size={25} /><strong>{vehicle.rangeKm}</strong><em>KM</em></div></div><div className="metrics-cell engine-metric"><span className="metrics-label">ENGINE TEMP</span><div className="metrics-reading metrics-stacked-reading"><Thermometer size={25} /><strong>{vehicle.engineTemperatureC}°C</strong></div><div className="engine-temp-scale"><small>C</small><span><i /></span><small>H</small></div></div></section>;
}

export function VehicleTpmsPanel({ vehicle }: { vehicle: VehicleData }) {
  const [frontLeft, frontRight, rearLeft, rearRight] = vehicle.tirePressurePsi;
  return <section className="vehicle-tpms-panel tpms-metric"><span className="metrics-label">TIRE PRESSURE (TPMS)</span><div className="tpms-visual"><span className="tpms-front-left">{frontLeft}<small>PSI</small><i className="tpms-connector" /></span><span className="tpms-front-right">{frontRight}<small>PSI</small><i className="tpms-connector" /></span><span className="tpms-rear-left">{rearLeft}<small>PSI</small><i className="tpms-connector" /></span><span className="tpms-rear-right">{rearRight}<small>PSI</small><i className="tpms-connector" /></span><img className="tpms-vehicle-image" src={TPMS_VEHICLE_IMAGE} alt="Vehicle" /></div></section>;
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
