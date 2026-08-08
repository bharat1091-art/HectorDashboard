import { NetworkData } from "@/types/dashboard";

type ConnectionInfo = { type?: string; downlink?: number };

type NavigatorWithConnection = Navigator & { connection?: ConnectionInfo };

export function getNetworkData(): NetworkData {
  const browserNavigator = navigator as NavigatorWithConnection;
  const connection = browserNavigator.connection;
  const online = navigator.onLine;
  const type = connection?.type;
  return {
    online,
    signalBars: online ? Math.min(4, Math.max(1, Math.round(connection?.downlink ?? 4))) : 0,
    connectivityType:
      type === "cellular" || type === "wifi" || type === "ethernet"
        ? type
        : online
          ? "unknown"
          : "offline",
  };
}

export const NetworkService = { getNetworkData };
