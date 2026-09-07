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
const ROUTE_PLATFORM_IMAGE = "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2Ff7cb561d798d4d689d2d1861f37e0dff?format=webp&width=800&height=1200";
const ROUTE_SEGMENT_PATHS = [
  "M138 132 H270 L286 145 L270 158 H138 Z",
  "M305 132 H430 L446 145 L430 158 H305 Z",
  "M555 132 H680 L696 145 L680 158 H555 Z",
  "M715 132 H840 L856 145 L840 158 H715 Z",
  "M875 132 H1010 L1026 145 L1010 158 H875 Z",
];
const ROUTE_CHEVRON_PATHS = [
  "M458 137 H470 L480 145 L470 153 H458 M486 137 H498 L508 145 L498 153 H486 M480 145 H486",
  "M697 137 H709 L719 145 L709 153 H697 M725 137 H737 L747 145 L737 153 H725 M719 145 H725",
  "M857 137 H869 L879 145 L869 153 H857 M885 137 H897 L907 145 L897 153 H885 M879 145 H885",
];

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
  const vehiclePosition = 8 + boundedProgress * 0.84;
  return (
    <section className="route-tracker">
      <div className="route-visual">
        <svg className="route-inline-svg" viewBox="0 0 1202 194" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="route-inline-glow" x="-20%" y="-300%" width="140%" height="700%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <clipPath id="route-completed-clip"><rect x="0" y="0" width={138 + 888 * boundedProgress / 100} height="194" /></clipPath>
          </defs>
          <g className="route-segment-layer route-segment-layer-remaining" filter="url(#route-inline-glow)">
            {ROUTE_SEGMENT_PATHS.map((path) => <path key={`remaining-${path}`} d={path} />)}
          </g>
          <g className="route-segment-layer route-segment-layer-completed" clipPath="url(#route-completed-clip)" filter="url(#route-inline-glow)">
            {ROUTE_SEGMENT_PATHS.map((path) => <path key={`completed-${path}`} d={path} />)}
          </g>
          <g className="route-chevron-layer" filter="url(#route-inline-glow)">
            {ROUTE_CHEVRON_PATHS.map((path, index) => {
              const chevronProgress = [39, 66, 84][index];
              const completed = boundedProgress >= chevronProgress;
              return <path key={path} className={completed ? "route-chevron-path route-chevron-path-completed" : "route-chevron-path route-chevron-path-remaining"} d={path} style={{ animationDelay: `${index * -0.35}s` }} />;
            })}
          </g>
        </svg>
        <div className="route-flag route-start"><img src={ROUTE_START_FLAG_IMAGE} alt="Start" /></div>
        <div className="route-flag route-end"><img src={ROUTE_END_FLAG_IMAGE} alt="Destination" /></div>
        <div className="vehicle-container" style={{ left: `${vehiclePosition}%` }}>
          <img className="vehicle-svg" src={ROUTE_SUV_IMAGE} alt="Vehicle" />
          <img className="platform-svg" src={ROUTE_PLATFORM_IMAGE} alt="" style={{ bottom: "18px", left: "120.494px" }} />
        </div>
      </div>
    </section>
  );
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
