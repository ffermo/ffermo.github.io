import { SpaceObject } from "../util/scene.util";
import { CameraControls } from "@react-three/drei";

export interface SpaceState {
  canvasState: CanvasState;
  cameraState: CameraState;
}

export interface CanvasState {
  width: number,
  height: number
}

export interface CameraState {
  target: SpaceObject;
  controls?: CameraControls;
}

export const initialCanvasState: CanvasState = {
  width: 0,
  height: 0,
}

export const initialCameraTargetState: CameraState = {
  target: SpaceObject.EARTH_SPHERE,
  controls: undefined,
}

export const initialSpaceState: SpaceState = {
  canvasState: initialCanvasState,
  cameraState: initialCameraTargetState,
}
