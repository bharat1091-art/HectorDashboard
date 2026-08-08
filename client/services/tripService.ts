import { TripRecord } from "@/types/dashboard";

export function getMockTrips(): TripRecord[] {
  return [
    { id: "trip-a", name: "Trip A", distanceKm: 231.8, totalDistanceKm: 612, avgSpeedKph: 100, durationLabel: "03:25", progressPercent: 37.9 },
    { id: "trip-b", name: "Trip B", distanceKm: 148.2, totalDistanceKm: 385, avgSpeedKph: 86, durationLabel: "02:42", progressPercent: 38.5 },
    { id: "trip-c", name: "Trip C", distanceKm: 87.4, totalDistanceKm: 260, avgSpeedKph: 74, durationLabel: "01:58", progressPercent: 33.6 },
  ];
}

export const TripService = { getMockTrips };
