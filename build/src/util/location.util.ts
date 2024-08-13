export interface Coordinates {
  lon: number;
  lat: number;
}

export const QUEZON_PH_LOC: Coordinates = { lon: 121, lat: 14.4 };
export const ORLANDO_FL_LOC: Coordinates = { lon: -81.2, lat: 28.3 };
export const LONGMONT_CO_LOC: Coordinates = { lon: -105.10, lat: 40.17 };

export function isNearTarget(local: Coordinates, target: Coordinates): boolean {
  return Math.abs(local.lat - target.lat) < .5 && 
    Math.abs(local.lon - target.lon) < .5
}