import { createAction } from "@reduxjs/toolkit";
import { CanvasState } from "./space.state";
import { SpaceTarget } from "../util/scene.util";
import { CameraControls } from "@react-three/drei";
import { GeoCoordinates } from "../util/location.util";

export enum SpaceActionTypes {
  UPDATE_SPACE_CANVAS_ACTION = "canvas/updateSpaceCanvasSize",
  SET_CAMERA_TARGET_ACTION = "canvas/setCameraTarget",
  SET_EARTH_TARGET_ACTION = "canvas/setEarthTarget",
  UPDATE_EARTH_TARGET_ACTION = "canvas/updateEarthTarget",
  SET_CAMERA_CONTROLS_ACTION = "canvas/setCameraControls"
}

export const UpdateSpaceCanvasAction = createAction<CanvasState>(SpaceActionTypes.UPDATE_SPACE_CANVAS_ACTION);
export const SetCameraTargetAction = createAction<SpaceTarget>(SpaceActionTypes.SET_CAMERA_TARGET_ACTION);
export const SetEarthTargetAction = createAction<GeoCoordinates>(SpaceActionTypes.SET_EARTH_TARGET_ACTION);
export const UpdateEarthTargetAction = createAction<GeoCoordinates>(SpaceActionTypes.UPDATE_EARTH_TARGET_ACTION);
export const SetCameraControlsAction = createAction<CameraControls>(SpaceActionTypes.SET_CAMERA_CONTROLS_ACTION);