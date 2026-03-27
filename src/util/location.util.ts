export interface GeoCoordinates {
  lon: number;
  lat: number;
}

export const QUEZON_PH_LOC: GeoCoordinates = { lon: 121, lat: 14.4 };
export const ORLANDO_FL_LOC: GeoCoordinates = { lon: -81.2, lat: 28.3 };
export const LONGMONT_CO_LOC: GeoCoordinates = { lon: -105.10, lat: 40.17 };

export function isNearTarget(local: GeoCoordinates, target: GeoCoordinates): boolean {
  return Math.abs(local.lat - target.lat) < .5 && 
    Math.abs(local.lon - target.lon) < .5
}