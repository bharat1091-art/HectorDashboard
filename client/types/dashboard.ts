export type WeatherCondition =
  | "thunderstorm"
  | "rain"
  | "drizzle"
  | "clouds"
  | "clear-day"
  | "clear-night"
  | "fog"
  | "mist"
  | "snow";

export interface WeatherData {
  condition: WeatherCondition;
  label: string;
  temperatureC: number;
  humidity: number;
  windSpeedKph: number;
  sunrise: string;
  sunset: string;
  updatedAt: number;
}

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  city: string;
  state: string;
  country: string;
}

export interface VehicleData {
  speedKph: number;
  avgSpeedKph: number;
  distanceTraveledKm: number;
  cabinTemperatureC: number;
  batteryVoltage: number;
  ignitionOn: boolean;
  engineOn: boolean;
}

export type ObdConnectionState =
  | "disconnected"
  | "scanning"
  | "connecting"
  | "connected";

export interface TripRecord {
  id: string;
  name: string;
  distanceKm: number;
  totalDistanceKm: number;
  avgSpeedKph: number;
  durationLabel: string;
  progressPercent: number;
}

export type NetworkConnectivityType =
  | "wifi"
  | "cellular"
  | "ethernet"
  | "offline"
  | "unknown";

export interface NetworkData {
  online: boolean;
  signalBars: number;
  connectivityType: NetworkConnectivityType;
}

export type DistanceUnit = "km" | "mi";
export type TemperatureUnit = "C" | "F";
export type ThemeMode = "dynamic" | "static";
export type TimeFormat = "12h" | "24h";
export type DashboardFontStyle = "rajdhani" | "bebas" | "mono";
export type FontScale = "90" | "100" | "110";
