import { HOURS_PER_DAY, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from "./time.util";

// From center of global coordinates ((0,0,0) to (100, 0, 0) is one astronomical unit.
export const AU_TO_CARTESIAN: number = 100;
export const KM_PER_AU = 149597870.691;

// Solar sphere scaling constants.
export const SUN_RADIUS: number = 0.0046524726 * AU_TO_CARTESIAN // Ratio of solar radius to AU. 
export const SUN_ROTATION_DAYS: number = 25.05; // Days to complete one full sun rotation.
export const SUN_RADIANS_PER_DAY: number = (2 * Math.PI) / SUN_ROTATION_DAYS;
export const SUN_RADIANS_PER_HOUR: number = SUN_RADIANS_PER_DAY / HOURS_PER_DAY;
export const SUN_RADIANS_PER_MINUTE: number = SUN_RADIANS_PER_HOUR / MINUTES_PER_HOUR;
export const SUN_RADIANS_PER_SECOND: number = SUN_RADIANS_PER_MINUTE / SECONDS_PER_MINUTE;

// Earth sphere scaling constants.
export const EARTH_RADIUS: number = SUN_RADIUS / 109;

export const EARTH_AU: number = AU_TO_CARTESIAN // Astronomical unit in cartesianal distance to earth.

// Earth orbital parameters (real values).
export const EARTH_ECCENTRICITY: number = 0.0167;
export const EARTH_SEMI_MAJOR: number = EARTH_AU; // 1 AU
export const EARTH_SEMI_MINOR: number = EARTH_SEMI_MAJOR * Math.sqrt(1 - EARTH_ECCENTRICITY ** 2);
export const EARTH_FOCAL_DISTANCE: number = EARTH_SEMI_MAJOR * EARTH_ECCENTRICITY; // Sun sits at this focus

const MS_PER_DAY = 86_400_000;

/**
 * Returns Earth's cumulative Y-axis rotation (radians) derived from current UTC time.
 * Can be used for delta calculations without wrap-around issues.
 */
export function getEarthUtcRotation(): number {
  return (Date.now() / MS_PER_DAY) * 2 * Math.PI;
}