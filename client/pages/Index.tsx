import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Activity, LocateFixed } from "lucide-react";
import { useLocationStore, useNetworkStore, useSettingsStore, useTripStore, useVehicleStore, useWeatherStore, startVehicleTelemetry } from "@/stores/dashboardStores";
import { WeatherEnvironment } from "@/components/dashboard/WeatherEnvironment";
import { BottomNavigation, DashboardSidebar, DistanceSection, RouteTracker, TelemetryStrip, VehicleMetricsPanel, VehicleStatusStrip, VehicleTpmsPanel, WeatherAdvisory, WeatherHeader } from "@/components/dashboard/DashboardComponents";

export default function Index() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [hmiScale, setHmiScale] = useState(1);
  const { weather, refreshWeather } = useWeatherStore();
  const { location, refreshLocation } = useLocationStore();
  const { vehicle, connection } = useVehicleStore();
  const { trips, selectedIndex, previousTrip, nextTrip } = useTripStore();
  const { distanceUnit, temperatureUnit, apiKey, themeMode, staticTheme, timeFormat, fontStyle, fontScale } = useSettingsStore();
  const { network, refreshNetwork } = useNetworkStore();
  const trip = trips[selectedIndex];
  const activeCondition = themeMode === "static" ? staticTheme : weather.condition;
  const routeProgress = Math.min(100, Math.max(0, trip.progressPercent + ((vehicle.distanceTraveledKm - 238.0) / Math.max(1, trip.totalDistanceKm)) * 100));

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

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateScale = () => {
      const vw = viewport.clientWidth;
      const vh = viewport.clientHeight;
      if (vw <= 0 || vh <= 0) return;

      const isLandscape = vw > vh;
      const isMobile = vw < 1024;

      if (isLandscape && isMobile) {
        const scale = Math.min(vw / 1506, vh / 941);
        setHmiScale(scale);
      } else {
        const scale = Math.min(1, vw / 1506, vh / 941);
        setHmiScale(scale);
      }
    };

    updateScale();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateScale);
      return () => window.removeEventListener("resize", updateScale);
    }

    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    window.addEventListener("orientationchange", updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", updateScale);
    };
  }, []);

  return (
    <main className={`dashboard-page theme-${activeCondition} font-${fontStyle} font-scale-${fontScale}`}>
      <WeatherEnvironment condition={activeCondition} />
      <div ref={viewportRef} className="hmi-scale-viewport">
        <div className="dashboard-shell" style={{ transform: `scale(${hmiScale})` }}>
          <div className="dashboard-panel">
            <WeatherHeader weather={weather} city={location.city} state={location.state} country={location.country} online={network.online} />
            <section className="dashboard-main">
              <div className="location-pulse"><LocateFixed size={14} /> <span>GPS POSITION LOCKED</span></div>
              <WeatherAdvisory condition={activeCondition} />
              <DistanceSection trip={trip} vehicle={vehicle} unit={distanceUnit} />
              <RouteTracker progress={routeProgress} />
            </section>
            <div className="lower-dashboard-area"><VehicleMetricsPanel vehicle={vehicle} duration={trip.durationLabel} /><VehicleTpmsPanel vehicle={vehicle} /><BottomNavigation trip={trip} onPrevious={previousTrip} onNext={nextTrip} /></div>
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
