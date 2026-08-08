import { useState } from "react";
import { ArrowLeft, Bluetooth, Check, Cloud, Cpu, Gauge, KeyRound, MapPin, Radio, Save, Settings2, SlidersHorizontal, Thermometer, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocationStore, useSettingsStore, useVehicleStore, useWeatherStore } from "@/stores/dashboardStores";
import { WeatherEnvironment } from "@/components/dashboard/WeatherEnvironment";

function SettingRow({ icon: Icon, title, description, children }: { icon: typeof Bluetooth; title: string; description: string; children: React.ReactNode }) {
  return <div className="setting-row"><div className="setting-icon"><Icon size={20} /></div><div className="setting-copy"><strong>{title}</strong><span>{description}</span></div><div className="setting-control">{children}</div></div>;
}

export default function Settings() {
  const { apiKey, refreshInterval, distanceUnit, temperatureUnit, themeMode, setApiKey, setRefreshInterval, setDistanceUnit, setTemperatureUnit, setThemeMode } = useSettingsStore();
  const { connection, deviceName, setConnection, setDeviceName } = useVehicleStore();
  const { location, refreshLocation, loading } = useLocationStore();
  const { weather } = useWeatherStore();
  const [saved, setSaved] = useState(false);
  const [pairing, setPairing] = useState(false);

  const pair = async () => {
    setPairing(true);
    setConnection("connecting");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setDeviceName("OBDLink MX+ Bluetooth");
    setConnection("connected");
    setPairing(false);
  };

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return <main className={`settings-page theme-${weather.condition}`}><WeatherEnvironment condition={weather.condition} /><div className="settings-shell"><header className="settings-header"><Link to="/" className="back-link"><ArrowLeft size={18} /> Dashboard</Link><div><span className="settings-kicker">VELOCITY // SYSTEM CONTROL</span><h1>Settings</h1></div><div className="settings-header-icon"><Settings2 /></div></header><div className="settings-grid"><section className="settings-card"><div className="settings-card-title"><Bluetooth /><div><h2>Vehicle connection</h2><p>Bluetooth OBD telemetry source</p></div><span className={`connection-badge ${connection}`}>{connection === "connected" ? <Check size={13} /> : <Radio size={13} />} {connection}</span></div><SettingRow icon={Bluetooth} title="OBD Bluetooth Connection" description={deviceName ?? "No device paired"}><button className="outline-control" onClick={pair} disabled={pairing}>{pairing ? "PAIRING..." : connection === "connected" ? "RECONNECT" : "PAIR DEVICE"}</button></SettingRow><SettingRow icon={Cpu} title="Engine telemetry" description="Ignition, speed and voltage readings"><span className="toggle-control on"><i /> ACTIVE</span></SettingRow></section><section className="settings-card"><div className="settings-card-title"><Cloud /><div><h2>Weather configuration</h2><p>Live OpenWeather environment</p></div></div><SettingRow icon={KeyRound} title="OpenWeather API key" description="Optional - mock weather used when empty"><input className="settings-input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter API key" type="password" /></SettingRow><SettingRow icon={Radio} title="Refresh interval" description="How often weather data updates"><select className="settings-select" value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))}><option value={5}>5 minutes</option><option value={10}>10 minutes</option><option value={30}>30 minutes</option></select></SettingRow></section><section className="settings-card"><div className="settings-card-title"><SlidersHorizontal /><div><h2>Units & appearance</h2><p>Personalise the HMI readout</p></div></div><SettingRow icon={Gauge} title="Distance units" description="Trip and speed measurements"><div className="segmented-control"><button className={distanceUnit === "km" ? "active" : ""} onClick={() => setDistanceUnit("km")}>KM</button><button className={distanceUnit === "mi" ? "active" : ""} onClick={() => setDistanceUnit("mi")}>MI</button></div></SettingRow><SettingRow icon={Thermometer} title="Temperature units" description="Cabin and outside temperature"><div className="segmented-control"><button className={temperatureUnit === "C" ? "active" : ""} onClick={() => setTemperatureUnit("C")}>°C</button><button className={temperatureUnit === "F" ? "active" : ""} onClick={() => setTemperatureUnit("F")}>°F</button></div></SettingRow><SettingRow icon={Cloud} title="Theme mode" description="Weather environments and animation"><div className="segmented-control wide"><button className={themeMode === "dynamic" ? "active" : ""} onClick={() => setThemeMode("dynamic")}>DYNAMIC</button><button className={themeMode === "static" ? "active" : ""} onClick={() => setThemeMode("static")}>STATIC</button></div></SettingRow></section><section className="settings-card"><div className="settings-card-title"><MapPin /><div><h2>Permissions & network</h2><p>Device access status</p></div></div><SettingRow icon={MapPin} title="Location permissions" description={`${location.city}, ${location.state}`}><button className="outline-control" onClick={refreshLocation}>{loading ? "LOCATING..." : "REFRESH"}</button></SettingRow><SettingRow icon={Wifi} title="Network status" description="Signal and connectivity"><span className="permission-status"><Check size={14} /> AVAILABLE</span></SettingRow></section></div><footer className="settings-footer"><span>VELOCITY HMI v1.0.0 // BUILD 2026.07</span><button className="save-button" onClick={save}><Save size={17} /> {saved ? "SAVED" : "SAVE SETTINGS"}</button></footer></div></main>;
}
