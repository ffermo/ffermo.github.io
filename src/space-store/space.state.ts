import { GeoCoordinates } from "../util/location.util";
import { SpaceTarget } from "../util/scene.util";
import { CameraControls } from "@react-three/drei";

export interface SpaceState {
  canvasState: CanvasState;
  cameraState: CameraState;
}

export interface CanvasState {
  width: number,
  height: number
}

export interface GeoCoordinateState {
  prevTarget?: GeoCoordinates,
  nextTarget?: GeoCoordinates
}

export interface CameraState {
  spaceTarget: SpaceTarget;
  earthTarget?: GeoCoordinateState;
  controls?: CameraControls;
}

export const initialCanvasState: CanvasState = {
  width: 0,
  height: 0,
}

export const initialCameraTargetState: CameraState = {
  spaceTarget: SpaceTarget.EARTH_SPHERE,
  earthTarget: {
    prevTarget: undefined,
    nextTarget: undefined
  },
  controls: undefined,
}

export const initialSpaceState: SpaceState = {
  canvasState: initialCanvasState,
  cameraState: initialCameraTargetState,
}
