import { createReducer, PayloadAction } from "@reduxjs/toolkit"
import { initialSpaceState, CanvasState } from "./space.state";
import { SetCameraTargetAction, UpdateSpaceCanvasAction } from "./space.actions";
import { SpaceObjectName } from "../util/scene.util";

export const spaceReducer = createReducer(initialSpaceState, (builder) => {
  builder
    .addCase(UpdateSpaceCanvasAction, (state, action: PayloadAction<CanvasState>) => {
      state.canvasState = action.payload;
    })
    .addCase(SetCameraTargetAction, (state, action: PayloadAction<SpaceObjectName>) => {
      state.cameraTarget = action.payload;
    })
});