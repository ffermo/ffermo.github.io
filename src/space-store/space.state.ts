import { SpaceObjectName } from "../util/scene.util";

export interface SpaceState {
  canvasState: CanvasState;
  cameraTarget: SpaceObjectName;
}

export interface CanvasState {
  width: number,
  height: number
}

export const initialCanvasState: CanvasState = {
  width: 0,
  height: 0,
}

export const initialSpaceState: SpaceState = {
  canvasState: initialCanvasState,
  cameraTarget: SpaceObjectName.EARTH_SPHERE
}