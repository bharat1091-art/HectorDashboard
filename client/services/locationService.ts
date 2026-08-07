import { LocationData } from "@/types/dashboard";

const FALLBACK_LOCATION: LocationData = {
  latitude: 23.0225,
  longitude: 72.5714,
  city: "Ahmedabad",
  state: "Gujarat",
  country: "India",
};

async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<Pick<LocationData, "city" | "state" | "country">> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    );
    if (!res.ok) throw new Error("reverse geocode failed");
    const data = await res.json();
    const address = data.address ?? {};
    return {
      city:
        address.city || address.town || address.village || FALLBACK_LOCATION.city,
      state: address.state || FALLBACK_LOCATION.state,
      country: address.country || FALLBACK_LOCATION.country,
    };
  } catch {
    return FALLBACK_LOCATION;
  }
}

export function getCurrentPosition(): Promise<LocationData> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(FALLBACK_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const place = await reverseGeocode(latitude, longitude);
        resolve({ latitude, longitude, ...place });
      },
      () => resolve(FALLBACK_LOCATION),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  });
}

export const LocationService = { getCurrentPosition, FALLBACK_LOCATION };
