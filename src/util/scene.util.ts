import { Vector3 } from "three";
import { EllipsePath } from "../ellipse-model/EllipseModel";

export const CAMERA_FOV: number = 60;
export const CAMERA_NEAR_PLANE: number = .001;
export const CAMERA_FAR_PLANE: number = 2000;
export const MAX_CAMERA_DIST: number = 48;
export const MIN_CAMERA_DIST: number = 1.5;

export enum SpaceObject {
  NONE = "None",
  SUN_SPHERE = "SunSphere",
  EARTH_SPHERE = "EarthSphere",
  EARTH_ELLIPSE = "EarthEllipse",
  CLOUD_SPHERE = "CloudSphere",
}

export interface EllipseProps {
  ellipsePoints?: Vector3[];
  ellipsePath?: EllipsePath;
}