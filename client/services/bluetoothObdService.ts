import { VehicleData } from "@/types/dashboard";

export const MOCK_OBD_DEVICE_NAME = "OBDLink MX+ Bluetooth";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createMockTelemetryTicker(
  onTick: (data: VehicleData) => void,
  intervalMs = 2000,
) {
  let speed = 50;
  let cabinTemp = 27;
  let distance = 236.1;

  const timer = setInterval(() => {
    speed = clamp(speed + (Math.random() - 0.5) * 12, 0, 180);
    cabinTemp = clamp(cabinTemp + (Math.random() - 0.5) * 0.6, 18, 32);
    distance += speed / 3600;

    onTick({
      speedKph: Math.round(speed),
      avgSpeedKph: 100,
      distanceTraveledKm: Math.round(distance * 10) / 10,
      cabinTemperatureC: Math.round(cabinTemp),
      batteryVoltage: 12.6,
      ignitionOn: true,
      engineOn: true,
    });
  }, intervalMs);

  return () => clearInterval(timer);
}

async function pairDevice(): Promise<{ name: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  return { name: MOCK_OBD_DEVICE_NAME };
}

async function connectDevice(): Promise<void> {
  await new Promise((r) => setTimeout(r, 1000));
}

async function disconnectDevice(): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}

export const BluetoothOBDService = {
  pairDevice,
  connectDevice,
  disconnectDevice,
  createMockTelemetryTicker,
};
