import { WeatherCondition, WeatherData } from "@/types/dashboard";

function isDaytime(sunrise: number, sunset: number, now: number) {
  return now >= sunrise && now < sunset;
}

export function mapOpenWeatherToCondition(
  main: string,
  isDay: boolean,
): WeatherCondition {
  switch (main.toLowerCase()) {
    case "thunderstorm":
      return "thunderstorm";
    case "rain":
      return "rain";
    case "drizzle":
      return "drizzle";
    case "clouds":
      return "clouds";
    case "fog":
      return "fog";
    case "mist":
    case "haze":
    case "smoke":
      return "mist";
    case "snow":
      return "snow";
    case "clear":
    default:
      return isDay ? "clear-day" : "clear-night";
  }
}

export const conditionLabels: Record<WeatherCondition, string> = {
  thunderstorm: "Thunderstorm",
  rain: "Rain",
  drizzle: "Drizzle",
  clouds: "Cloudy",
  "clear-day": "Clear Sky",
  "clear-night": "Clear Night",
  fog: "Fog",
  mist: "Mist",
  snow: "Snow",
};

function mockWeather(condition: WeatherCondition = "thunderstorm"): WeatherData {
  return {
    condition,
    label: conditionLabels[condition],
    temperatureC: 27,
    humidity: 78,
    windSpeedKph: 22,
    sunrise: "06:12 AM",
    sunset: "07:24 PM",
    updatedAt: Date.now(),
  };
}

export async function fetchWeather(
  latitude: number | null,
  longitude: number | null,
  apiKey: string,
): Promise<WeatherData> {
  if (!apiKey || latitude === null || longitude === null) {
    return mockWeather();
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`,
    );
    if (!res.ok) throw new Error("weather request failed");
    const data = await res.json();
    const now = Date.now() / 1000;
    const isDay = isDaytime(data.sys.sunrise, data.sys.sunset, now);
    const condition = mapOpenWeatherToCondition(data.weather[0].main, isDay);

    return {
      condition,
      label: conditionLabels[condition],
      temperatureC: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeedKph: Math.round(data.wind.speed * 3.6),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: Date.now(),
    };
  } catch {
    return mockWeather();
  }
}

export const WeatherService = { fetchWeather };
