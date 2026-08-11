import { create } from "zustand";
import { createMockTelemetryTicker } from "@/services/bluetoothObdService";
import { fetchWeather } from "@/services/weatherService";
import { getCurrentPosition } from "@/services/locationService";
import {
  DashboardFontStyle,
  DistanceUnit,
  FontScale,
  LocationData,
  NetworkData,
  ObdConnectionState,
  TemperatureUnit,
  ThemeMode,
  TimeFormat,
  TripRecord,
  VehicleData,
  WeatherCondition,
  WeatherData,
} from "@/types/dashboard";

const defaultWeather: WeatherData = {
  condition: "thunderstorm",
  label: "Thunderstorm",
  temperatureC: 27,
  humidity: 78,
  windSpeedKph: 22,
  sunrise: "06:12 AM",
  sunset: "07:24 PM",
  updatedAt: Date.now(),
};

const defaultVehicle: VehicleData = {
  speedKph: 50,
  avgSpeedKph: 100,
  distanceTraveledKm: 236.1,
  cabinTemperatureC: 27,
  fuelPercent: 58,
  rangeKm: 420,
  engineTemperatureC: 92,
  tirePressurePsi: [32, 33, 32, 34],
  batteryVoltage: 13.6,
  ignitionOn: true,
  engineOn: true,
};

const defaultTrips: TripRecord[] = [
  {
    id: "trip-a",
    name: "Trip A",
    distanceKm: 231.8,
    totalDistanceKm: 612,
    avgSpeedKph: 100,
    durationLabel: "03:25",
    progressPercent: 37.9,
  },
  {
    id: "trip-b",
    name: "Trip B",
    distanceKm: 148.2,
    totalDistanceKm: 385,
    avgSpeedKph: 86,
    durationLabel: "02:42",
    progressPercent: 38.5,
  },
  {
    id: "trip-c",
    name: "Trip C",
    distanceKm: 87.4,
    totalDistanceKm: 260,
    avgSpeedKph: 74,
    durationLabel: "01:58",
    progressPercent: 33.6,
  },
];

interface WeatherStore {
  weather: WeatherData;
  loading: boolean;
  setWeather: (weather: WeatherData) => void;
  refreshWeather: (location: LocationData, apiKey: string) => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  weather: defaultWeather,
  loading: false,
  setWeather: (weather) => set({ weather }),
  refreshWeather: async (location, apiKey) => {
    set({ loading: true });
    const weather = await fetchWeather(location.latitude, location.longitude, apiKey);
    set({ weather, loading: false });
  },
}));

interface LocationStore {
  location: LocationData;
  loading: boolean;
  refreshLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set) => ({
  location: {
    latitude: null,
    longitude: null,
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
  },
  loading: false,
  refreshLocation: async () => {
    set({ loading: true });
    const location = await getCurrentPosition();
    set({ location, loading: false });
  },
}));

interface VehicleStore {
  vehicle: VehicleData;
  connection: ObdConnectionState;
  deviceName: string | null;
  setVehicle: (vehicle: VehicleData) => void;
  setConnection: (connection: ObdConnectionState) => void;
  setDeviceName: (deviceName: string | null) => void;
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicle: defaultVehicle,
  connection: "connected",
  deviceName: "OBDLink MX+ Bluetooth",
  setVehicle: (vehicle) => set({ vehicle }),
  setConnection: (connection) => set({ connection }),
  setDeviceName: (deviceName) => set({ deviceName }),
}));

interface TripStore {
  trips: TripRecord[];
  selectedIndex: number;
  selectTrip: (index: number) => void;
  nextTrip: () => void;
  previousTrip: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: defaultTrips,
  selectedIndex: 0,
  selectTrip: (selectedIndex) => set({ selectedIndex }),
  nextTrip: () =>
    set((state) => ({ selectedIndex: (state.selectedIndex + 1) % state.trips.length })),
  previousTrip: () =>
    set((state) => ({
      selectedIndex:
        (state.selectedIndex - 1 + state.trips.length) % state.trips.length,
    })),
}));

interface SettingsStore {
  apiKey: string;
  refreshInterval: number;
  distanceUnit: DistanceUnit;
  temperatureUnit: TemperatureUnit;
  themeMode: ThemeMode;
  staticTheme: WeatherCondition;
  timeFormat: TimeFormat;
  fontStyle: DashboardFontStyle;
  fontScale: FontScale;
  setApiKey: (apiKey: string) => void;
  setRefreshInterval: (refreshInterval: number) => void;
  setDistanceUnit: (distanceUnit: DistanceUnit) => void;
  setTemperatureUnit: (temperatureUnit: TemperatureUnit) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setStaticTheme: (staticTheme: WeatherCondition) => void;
  setTimeFormat: (timeFormat: TimeFormat) => void;
  setFontStyle: (fontStyle: DashboardFontStyle) => void;
  setFontScale: (fontScale: FontScale) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY ?? "",
  refreshInterval: 10,
  distanceUnit: "km",
  temperatureUnit: "C",
  themeMode: "dynamic",
  staticTheme: "clouds",
  timeFormat: "12h",
  fontStyle: "rajdhani",
  fontScale: "100",
  setApiKey: (apiKey) => set({ apiKey }),
  setRefreshInterval: (refreshInterval) => set({ refreshInterval }),
  setDistanceUnit: (distanceUnit) => set({ distanceUnit }),
  setTemperatureUnit: (temperatureUnit) => set({ temperatureUnit }),
  setThemeMode: (themeMode) => set({ themeMode }),
  setStaticTheme: (staticTheme) => set({ staticTheme }),
  setTimeFormat: (timeFormat) => set({ timeFormat }),
  setFontStyle: (fontStyle) => set({ fontStyle }),
  setFontScale: (fontScale) => set({ fontScale }),
}));

interface NetworkStore {
  network: NetworkData;
  refreshNetwork: () => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  network: { online: navigator.onLine, signalBars: 4, connectivityType: "wifi" },
  refreshNetwork: () => {
    const connection = (navigator as Navigator & { connection?: { type?: string; downlink?: number } }).connection;
    const type = connection?.type;
    set({
      network: {
        online: navigator.onLine,
        signalBars: navigator.onLine ? Math.min(4, Math.max(1, Math.round(connection?.downlink ?? 4))) : 0,
        connectivityType:
          type === "cellular" || type === "wifi" || type === "ethernet" ? type : navigator.onLine ? "unknown" : "offline",
      },
    });
  },
}));

export const startVehicleTelemetry = () => {
  const unsubscribe = createMockTelemetryTicker((vehicle) => {
    useVehicleStore.getState().setVehicle(vehicle);
  });
  return unsubscribe;
};
