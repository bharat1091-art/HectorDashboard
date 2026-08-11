import { useEffect } from "react";
import { Activity, LocateFixed } from "lucide-react";
import { useLocationStore, useNetworkStore, useSettingsStore, useTripStore, useVehicleStore, useWeatherStore, startVehicleTelemetry } from "@/stores/dashboardStores";
import { WeatherEnvironment } from "@/components/dashboard/WeatherEnvironment";
import { BottomNavigation, DashboardSidebar, DistanceSection, RouteTracker, TelemetryStrip, VehicleMetricsPanel, VehicleStatusStrip, WeatherAdvisory, WeatherHeader } from "@/components/dashboard/DashboardComponents";

export default function Index() {
  const { weather, refreshWeather } = useWeatherStore();
  const { location, refreshLocation } = useLocationStore();
  const { vehicle, connection } = useVehicleStore();
  const { trips, selectedIndex, previousTrip, nextTrip } = useTripStore();
  const { distanceUnit, temperatureUnit, apiKey, themeMode, staticTheme, timeFormat, fontStyle, fontScale } = useSettingsStore();
  const { network, refreshNetwork } = useNetworkStore();
  const trip = trips[selectedIndex];
  const activeCondition = themeMode === "static" ? staticTheme : weather.condition;
  const routeProgress = Math.min(100, Math.max(0, trip.progressPercent + ((vehicle.distanceTraveledKm - 236.1) / Math.max(1, trip.totalDistanceKm)) * 100));

  useEffect(() => {
    refreshLocation();
    refreshNetwork();
    const unsubscribe = startVehicleTelemetry();
    return unsubscribe;
  }, [refreshLocation, refreshNetwork]);

  useEffect(() => {
    refreshWeather(location, apiKey);
  }, [location, apiKey, refreshWeather]);

  const temperature = temperatureUnit === "F" ? Math.round(weather.temperatureC * 1.8 + 32) : weather.temperatureC;

  return (
    <main className={`dashboard-page theme-${activeCondition} font-${fontStyle} font-scale-${fontScale}`}>
      <WeatherEnvironment condition={activeCondition} />
      <div className="hmi-scale-viewport">
        <div className="dashboard-shell">
          <div className="dashboard-panel">
            <WeatherHeader weather={weather} city={location.city} state={location.state} country={location.country} online={network.online} />
            <section className="dashboard-main">
              <div className="location-pulse"><LocateFixed size={14} /> <span>GPS POSITION LOCKED</span></div>
              <WeatherAdvisory condition={activeCondition} />
              <DistanceSection trip={trip} vehicle={vehicle} unit={distanceUnit} />
              <RouteTracker progress={routeProgress} />
              <VehicleMetricsPanel vehicle={vehicle} duration={trip.durationLabel} />
            </section>
            <BottomNavigation trip={trip} onPrevious={previousTrip} onNext={nextTrip} />
            <VehicleStatusStrip vehicle={vehicle} connection={connection} network={network} />
          </div>
          <DashboardSidebar weather={{ ...weather, temperatureC: temperature }} vehicle={vehicle} temperatureUnit={temperatureUnit} timeFormat={timeFormat} />
        </div>
      </div>
      <div className="dashboard-status"><Activity size={14} /> LIVE VEHICLE TELEMETRY <span /> UPDATED JUST NOW</div>
      <div className="mobile-weather-chip">{weather.label}</div>
    </main>
  );
}
