import { createAction } from "@reduxjs/toolkit";
import { CanvasState } from "./space.state";
import { SpaceObject } from "../util/scene.util";
import { CameraControls } from "@react-three/drei";

export enum SpaceActionTypes {
  UPDATE_SPACE_CANVAS_ACTION = "canvas/updateSpaceCanvasSize",
  SET_CAMERA_TARGET_ACTION = "canvas/setCameraTarget",
  SET_CAMERA_CONTROLS_ACTION = "canvas/setCameraControls"
}

export const UpdateSpaceCanvasAction = createAction<CanvasState>(SpaceActionTypes.UPDATE_SPACE_CANVAS_ACTION);
export const SetCameraTargetAction = createAction<SpaceObject>(SpaceActionTypes.SET_CAMERA_TARGET_ACTION);
export const SetCameraControlsAction = createAction<CameraControls>(SpaceActionTypes.SET_CAMERA_CONTROLS_ACTION);