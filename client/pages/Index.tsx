import { useEffect } from "react";
import { Activity, LocateFixed } from "lucide-react";
import { useLocationStore, useNetworkStore, useSettingsStore, useTripStore, useVehicleStore, useWeatherStore, startVehicleTelemetry } from "@/stores/dashboardStores";
import { WeatherEnvironment } from "@/components/dashboard/WeatherEnvironment";
import { BottomNavigation, DashboardSidebar, DistanceSection, RouteTracker, TelemetryStrip, TripTimeSection, WeatherHeader } from "@/components/dashboard/DashboardComponents";

export default function Index() {
  const { weather, refreshWeather } = useWeatherStore();
  const { location, refreshLocation } = useLocationStore();
  const { vehicle, connection } = useVehicleStore();
  const { trips, selectedIndex, previousTrip, nextTrip } = useTripStore();
  const { distanceUnit, temperatureUnit, apiKey } = useSettingsStore();
  const { network, refreshNetwork } = useNetworkStore();
  const trip = trips[selectedIndex];

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
    <main className={`dashboard-page theme-${weather.condition}`}>
      <WeatherEnvironment condition={weather.condition} />
      <div className="hmi-scale-viewport">
        <div className="dashboard-shell">
          <div className="dashboard-panel">
            <WeatherHeader weather={weather} city={location.city} state={location.state} country={location.country} online={network.online} />
            <section className="dashboard-main">
              <div className="location-pulse"><LocateFixed size={14} /> <span>GPS POSITION LOCKED</span></div>
              <DistanceSection trip={trip} vehicle={vehicle} unit={distanceUnit} />
              <RouteTracker />
              <TripTimeSection duration={trip.durationLabel} />
              <TelemetryStrip vehicle={vehicle} connection={connection} />
            </section>
            <BottomNavigation trip={trip} onPrevious={previousTrip} onNext={nextTrip} />
          </div>
          <DashboardSidebar weather={{ ...weather, temperatureC: temperature }} vehicle={vehicle} temperatureUnit={temperatureUnit} />
        </div>
      </div>
      <div className="dashboard-status"><Activity size={14} /> LIVE VEHICLE TELEMETRY <span /> UPDATED JUST NOW</div>
      <div className="mobile-weather-chip">{weather.label}</div>
    </main>
  );
}
