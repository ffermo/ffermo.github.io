import { createReducer, PayloadAction } from "@reduxjs/toolkit"
import { initialSpaceState, CanvasState } from "./space.state";
import { SetCameraControlsAction, SetCameraTargetAction, UpdateSpaceCanvasAction } from "./space.actions";
import { SpaceObject } from "../util/scene.util";
import { CameraControls } from "@react-three/drei";

export const spaceReducer = createReducer(initialSpaceState, (builder) => {
  builder
    .addCase(UpdateSpaceCanvasAction, (state, action: PayloadAction<CanvasState>) => {
      state.canvasState = action.payload;
    })
    .addCase(SetCameraTargetAction, (state, action: PayloadAction<SpaceObject>) => {
      state.cameraState.target = action.payload;
    })
    .addCase(SetCameraControlsAction, (state, action: PayloadAction<CameraControls>) => {
      state.cameraState.controls = action.payload;
    })
});