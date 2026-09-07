import { CloudLightning, Droplets, Moon, Snowflake, Sun, Wind } from "lucide-react";
import { WeatherCondition } from "@/types/dashboard";

interface WeatherEnvironmentProps {
  condition: WeatherCondition;
}

const WEATHER_REFERENCE_IMAGES: Record<WeatherCondition, string> = {
  "clear-day": "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2F5f0753cea6bc44e28566e6e127f4580b?format=webp&width=800&height=1200",
  thunderstorm: "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2F31449440d4df4b7c930c7bcc7ea4875c?format=webp&width=800&height=1200",
  "clear-night": "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2Fdc4330029b144cac874fdf0f4e96fa10?format=webp&width=800&height=1200",
  clouds: "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2F414695e55f58458e86ad25ca2013eeeb?format=webp&width=800&height=1200",
  rain: "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2Fadd4497f1537450ba98a3f83c71ac294?format=webp&width=800&height=1200",
  drizzle: "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2Fadd4497f1537450ba98a3f83c71ac294?format=webp&width=800&height=1200",
  snow: "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2F5e33d94fa04d4cc793b5c3b232f33a68?format=webp&width=800&height=1200",
  fog: "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2F012f6803de09420b8e0a5bb868d7ae8b?format=webp&width=800&height=1200",
  mist: "https://cdn.builder.io/api/v1/image/assets%2F582e3ebccd4842d282419e49311a35af%2F9084ef86a3704f34ad64f50c9c1fd6b3?format=webp&width=800&height=1200",
};

export function WeatherEnvironment({ condition }: WeatherEnvironmentProps) {
  const isStorm = condition === "thunderstorm";
  const isSnow = condition === "snow";
  const isNight = condition === "clear-night";
  const isFog = condition === "fog" || condition === "mist";
  const isRain = condition === "rain" || condition === "drizzle";
  return (
    <div
      className={`weather-environment weather-${condition}`}
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(3, 10, 24, .16), rgba(3, 8, 22, .72)), url(${WEATHER_REFERENCE_IMAGES[condition]})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      aria-hidden="true"
    >
      <div className="environment-glow" />
      {isStorm && <div className="lightning-layer" />}
      {isRain && <div className="rain-layer"><i /><i /><i /><i /><i /><i /><i /><i /></div>}
      {isSnow && (
        <div className="snow-layer">
          <Snowflake /><Snowflake /><Snowflake /><Snowflake /><Snowflake />
        </div>
      )}
      {isNight && (
        <div className="star-layer"><i /><i /><i /><i /><i /><i /><i /></div>
      )}
      {isFog && <div className="fog-layer"><span /><span /><span /></div>}
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
