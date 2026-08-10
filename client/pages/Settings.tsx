import { useState } from "react";
import { ArrowLeft, Bluetooth, Check, Cloud, Cpu, Gauge, KeyRound, MapPin, Palette, Radio, Save, Settings2, SlidersHorizontal, Thermometer, Type, Wifi, Clock3, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocationStore, useSettingsStore, useVehicleStore, useWeatherStore } from "@/stores/dashboardStores";
import { WeatherEnvironment } from "@/components/dashboard/WeatherEnvironment";
import { DashboardFontStyle, FontScale, ThemeMode, TimeFormat, WeatherCondition } from "@/types/dashboard";

function SettingRow({ icon: Icon, title, description, children }: { icon: typeof Bluetooth; title: string; description: string; children: React.ReactNode }) {
  return <div className="setting-row"><div className="setting-icon"><Icon size={20} /></div><div className="setting-copy"><strong>{title}</strong><span>{description}</span></div><div className="setting-control">{children}</div></div>;
}

const staticThemes: Array<{ value: WeatherCondition; label: string }> = [
  { value: "clear-day", label: "Clear Day" },
  { value: "clear-night", label: "Clear Night" },
  { value: "clouds", label: "Cloudy" },
  { value: "rain", label: "Rain" },
  { value: "thunderstorm", label: "Thunderstorm" },
  { value: "snow", label: "Snow" },
  { value: "fog", label: "Fog" },
];

export default function Settings() {
  const { apiKey, refreshInterval, distanceUnit, temperatureUnit, themeMode, staticTheme, timeFormat, fontStyle, fontScale, setApiKey, setRefreshInterval, setDistanceUnit, setTemperatureUnit, setThemeMode, setStaticTheme, setTimeFormat, setFontStyle, setFontScale } = useSettingsStore();
  const { connection, deviceName, setConnection, setDeviceName } = useVehicleStore();
  const { location, refreshLocation, loading } = useLocationStore();
  const { weather } = useWeatherStore();
  const [saved, setSaved] = useState(false);
  const [pairing, setPairing] = useState(false);
  const activeCondition = themeMode === "static" ? staticTheme : weather.condition;

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

  return <main className={`settings-page theme-${activeCondition} font-${fontStyle} font-scale-${fontScale}`}><WeatherEnvironment condition={activeCondition} /><div className="settings-shell"><header className="settings-header"><Link to="/" className="back-link"><ArrowLeft size={18} /> Dashboard</Link><div><span className="settings-kicker">VELOCITY // SYSTEM CONTROL</span><h1>Settings</h1></div><div className="settings-header-icon"><Settings2 /></div></header><div className="settings-grid">
    <section className="settings-card"><div className="settings-card-title"><Bluetooth /><div><h2>Vehicle connection</h2><p>Bluetooth OBD telemetry source</p></div><span className={`connection-badge ${connection}`}>{connection === "connected" ? <Check size={13} /> : <Radio size={13} />} {connection}</span></div><SettingRow icon={Bluetooth} title="OBD Bluetooth Connection" description={deviceName ?? "No device paired"}><button className="outline-control" onClick={pair} disabled={pairing}>{pairing ? "PAIRING..." : connection === "connected" ? "RECONNECT" : "PAIR DEVICE"}</button></SettingRow><SettingRow icon={Cpu} title="Engine telemetry" description="Ignition, speed and voltage readings"><span className="toggle-control on"><i /> ACTIVE</span></SettingRow></section>
    <section className="settings-card"><div className="settings-card-title"><Cloud /><div><h2>Weather configuration</h2><p>Live OpenWeather environment</p></div></div><SettingRow icon={KeyRound} title="OpenWeather API key" description="Optional - mock weather used when empty"><input className="settings-input" type="password" value={apiKey} placeholder="Enter API key" onChange={(event) => setApiKey(event.target.value)} /></SettingRow><SettingRow icon={MapPin} title="Vehicle location" description={`${location.city}, ${location.state}`}><button className="outline-control" onClick={refreshLocation} disabled={loading}>{loading ? "LOCATING..." : "REFRESH GPS"}</button></SettingRow><SettingRow icon={SlidersHorizontal} title="Refresh interval" description="Weather polling interval"><select className="settings-select" value={refreshInterval} onChange={(event) => setRefreshInterval(Number(event.target.value))}><option value={5}>5 sec</option><option value={10}>10 sec</option><option value={30}>30 sec</option></select></SettingRow></section>
    <section className="settings-card"><div className="settings-card-title"><Palette /><div><h2>Static weather themes</h2><p>Choose the environment when dynamic mode is off</p></div></div><SettingRow icon={Cloud} title="Theme mode" description="Follow OpenWeather or choose manually"><select className="settings-select" value={themeMode} onChange={(event) => setThemeMode(event.target.value as ThemeMode)}><option value="dynamic">Dynamic</option><option value="static">Static</option></select></SettingRow><SettingRow icon={Sun} title="Static theme" description="Active immediately in static mode"><select className="settings-select" value={staticTheme} disabled={themeMode === "dynamic"} onChange={(event) => setStaticTheme(event.target.value as WeatherCondition)}>{staticThemes.map((theme) => <option key={theme.value} value={theme.value}>{theme.label}</option>)}</select></SettingRow><div className="theme-preview"><span className={`theme-preview-dot theme-${activeCondition}`} /> Active: {staticThemes.find((theme) => theme.value === activeCondition)?.label ?? weather.label}</div></section>
    <section className="settings-card"><div className="settings-card-title"><Type /><div><h2>Typography</h2><p>Shared dashboard and settings type system</p></div></div><SettingRow icon={Clock3} title="Time format" description="Clock and sidebar time display"><select className="settings-select" value={timeFormat} onChange={(event) => setTimeFormat(event.target.value as TimeFormat)}><option value="12h">12 Hour</option><option value="24h">24 Hour</option></select></SettingRow><SettingRow icon={Type} title="Dashboard font style" description="Primary HMI typography"><select className="settings-select" value={fontStyle} onChange={(event) => setFontStyle(event.target.value as DashboardFontStyle)}><option value="rajdhani">Rajdhani</option><option value="bebas">Bebas display</option><option value="mono">Tech mono</option></select></SettingRow><SettingRow icon={Gauge} title="Font size scaling" description="Scale dashboard typography"><select className="settings-select" value={fontScale} onChange={(event) => setFontScale(event.target.value as FontScale)}><option value="90">90%</option><option value="100">100%</option><option value="110">110%</option></select></SettingRow></section>
    <section className="settings-card"><div className="settings-card-title"><Thermometer /><div><h2>Display units</h2><p>Vehicle and weather measurements</p></div></div><SettingRow icon={Gauge} title="Distance unit" description="Trip distance and route values"><select className="settings-select" value={distanceUnit} onChange={(event) => setDistanceUnit(event.target.value as "km" | "mi")}><option value="km">Kilometers</option><option value="mi">Miles</option></select></SettingRow><SettingRow icon={Thermometer} title="Temperature unit" description="Outside and cabin temperature"><select className="settings-select" value={temperatureUnit} onChange={(event) => setTemperatureUnit(event.target.value as "C" | "F")}><option value="C">Celsius</option><option value="F">Fahrenheit</option></select></SettingRow></section>
    <section className="settings-card"><div className="settings-card-title"><Wifi /><div><h2>Permissions & status</h2><p>Browser capabilities and network</p></div></div><SettingRow icon={Wifi} title="Network access" description="Used for weather and connectivity"><span className="toggle-control on"><i /> {navigator.onLine ? "ONLINE" : "OFFLINE"}</span></SettingRow><SettingRow icon={MapPin} title="Location permission" description="Browser GPS access"><span className="toggle-control on"><i /> AVAILABLE</span></SettingRow><SettingRow icon={Bluetooth} title="Bluetooth permission" description="OBD device access"><span className="toggle-control on"><i /> READY</span></SettingRow></section>
  </div><footer className="settings-footer"><span>VELOCITY HMI // v1.0.0</span><button className="save-button" onClick={save}><Save size={17} /> {saved ? "SAVED" : "SAVE SETTINGS"}</button></footer></div></main>;
}
