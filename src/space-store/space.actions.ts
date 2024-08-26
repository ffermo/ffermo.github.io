import { createAction } from "@reduxjs/toolkit";
import { CanvasState } from "./space.state";
import { SpaceObjectName } from "../util/scene.util";

export enum SpaceActionTypes {
  UPDATE_SPACE_CANVAS_ACTION = "canvas/updateSpaceCanvasSize",
  SET_CAMERA_TARGET_ACTION = "canvas/setCameraTarget",
}
export const UpdateSpaceCanvasAction = createAction<CanvasState>(SpaceActionTypes.UPDATE_SPACE_CANVAS_ACTION);
export const SetCameraTargetAction = createAction<SpaceObjectName>(SpaceActionTypes.SET_CAMERA_TARGET_ACTION);