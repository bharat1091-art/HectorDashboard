import { CloudLightning, CloudSnow, CloudSun, Droplets, Moon, Snowflake, Sun, Wind } from "lucide-react";
import { WeatherCondition } from "@/types/dashboard";

interface WeatherEnvironmentProps {
  condition: WeatherCondition;
}

export function WeatherEnvironment({ condition }: WeatherEnvironmentProps) {
  const isStorm = condition === "thunderstorm";
  const isSnow = condition === "snow";
  const isNight = condition === "clear-night";
  const isFog = condition === "fog" || condition === "mist";
  const isClear = condition === "clear-day";

  return (
    <div className={`weather-environment weather-${condition}`} aria-hidden="true">
      <div className="environment-glow" />
      {isStorm && <div className="lightning-layer" />}
      {isSnow && (
        <div className="snow-layer">
          <Snowflake /><Snowflake /><Snowflake /><Snowflake /><Snowflake />
        </div>
      )}
      {isNight && (
        <div className="star-layer"><i /><i /><i /><i /><i /><i /><i /></div>
      )}
      {isFog && <div className="fog-layer"><span /><span /><span /></div>}
      <div className="weather-horizon" />
      <div className="environment-icon">
        {isStorm && <CloudLightning />}
        {isSnow && <CloudSnow />}
        {isNight && <Moon />}
        {isClear && <Sun />}
        {condition === "clouds" && <CloudSun />}
        {isFog && <Wind />}
      </div>
    </div>
  );
}

export function WeatherModeHint({ condition }: { condition: WeatherCondition }) {
  if (condition === "thunderstorm") return <span className="mode-hint"><CloudLightning size={13} /> Storm mode</span>;
  if (condition === "rain" || condition === "drizzle") return <span className="mode-hint"><Droplets size={13} /> Rain mode</span>;
  if (condition === "snow") return <span className="mode-hint"><Snowflake size={13} /> Snow mode</span>;
  if (condition === "clear-day") return <span className="mode-hint"><Sun size={13} /> Clear day</span>;
  if (condition === "clear-night") return <span className="mode-hint"><Moon size={13} /> Clear night</span>;
  return <span className="mode-hint"><Wind size={13} /> {condition === "clouds" ? "Cloudy mode" : "Fog mode"}</span>;
}
