export function getCurrentTime() {
  return new Date();
}

export function formatTime(date = getCurrentTime()) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatDate(date = getCurrentTime()) {
  return date.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDay(date = getCurrentTime()) {
  return date.toLocaleDateString([], { weekday: "long" });
}

export const TimeService = { getCurrentTime, formatTime, formatDate, formatDay };
