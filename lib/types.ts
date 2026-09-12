import * as THREE from "three";

export interface WatchPart {
  name: string;
  object: THREE.Object3D;
  originalPosition: THREE.Vector3;
  separatedPosition: THREE.Vector3;
}

export interface WatchPartsMap {
  [key: string]: WatchPart;
}

export interface ResponsiveConfig {
  watchScale: number;
  fov: number;
  cameraPosition: [number, number, number];
}

export type DeviceType = "mobile" | "tablet" | "desktop";

export function getDeviceType(width: number): DeviceType {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function getResponsiveConfig(deviceType: DeviceType): ResponsiveConfig {
  switch (deviceType) {
    case "mobile":
      return {
        watchScale: 0.08,
        fov: 60,
        cameraPosition: [0, 0, 6],
      };
    case "tablet":
      return {
        watchScale: 0.1,
        fov: 55,
        cameraPosition: [0, 0, 5.5],
      };
    case "desktop":
    default:
      return {
        watchScale: 0.115,
        fov: 50,
        cameraPosition: [0, 0, 5],
      };
  }
}
