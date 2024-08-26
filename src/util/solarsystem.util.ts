import { HOURS_PER_DAY, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from "./time.util";

// From center of global coordinates ((0,0,0) to (100, 0, 0) is one astronomical unit.
export const AU_TO_CARTESIAN: number = 100;
export const KM_PER_AU = 149597870.691;

// Solar sphere scaling constants.
export const SUN_RADIUS: number = 0.0046524726 * AU_TO_CARTESIAN // Ratio of solar radius to AU. 
// export const SUN_RADIUS: number = SUN_RADIUS_AU * AU_TO_CARTESIAN // Ratio of solar radius to AU. 
export const SUN_ROTATION_DAYS: number = 25.05; // Days to complete one full sun rotation.
export const SUN_RADIANS_PER_DAY: number = (2 * Math.PI) / SUN_ROTATION_DAYS;
export const SUN_RADIANS_PER_HOUR: number = SUN_RADIANS_PER_DAY / HOURS_PER_DAY;
export const SUN_RADIANS_PER_MINUTE: number = SUN_RADIANS_PER_HOUR / MINUTES_PER_HOUR;
export const SUN_RADIANS_PER_SECOND: number = SUN_RADIANS_PER_MINUTE / SECONDS_PER_MINUTE;

// Earth sphere scaling constants.
export const EARTH_RADIUS: number = SUN_RADIUS / 109;
// export const EARTH_RADIUS: number = EARTH_RADIUS_AU * AU_TO_CARTESIAN;
export const EARTH_ROTATION_DAYS: number = 1; // Days to complete one full earth rotation.
export const EARTH_RADIANS_PER_DAY: number = (2 * Math.PI) / EARTH_ROTATION_DAYS;
export const EARTH_RADIANS_PER_HOUR: number = EARTH_RADIANS_PER_DAY / HOURS_PER_DAY;
export const EARTH_RADIANS_PER_MINUTE: number = EARTH_RADIANS_PER_HOUR / MINUTES_PER_HOUR;
export const EARTH_RADIANS_PER_SECOND: number = EARTH_RADIANS_PER_MINUTE / SECONDS_PER_MINUTE;

export const EARTH_AU: number = AU_TO_CARTESIAN // Astronomical unit in cartesianal distance to earth.