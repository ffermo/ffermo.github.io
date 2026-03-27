import { createReducer, PayloadAction } from "@reduxjs/toolkit"
import { initialSpaceState, CanvasState } from "./space.state";
import { SetCameraControlsAction, SetCameraTargetAction, SetEarthTargetAction, UpdateEarthTargetAction, UpdateSpaceCanvasAction } from "./space.actions";
import { SpaceTarget } from "../util/scene.util";
import { CameraControls } from "@react-three/drei";
import { GeoCoordinates } from "../util/location.util";

export const spaceReducer = createReducer(initialSpaceState, (builder) => {
  builder
    .addCase(UpdateSpaceCanvasAction, (state, action: PayloadAction<CanvasState>) => {
      state.canvasState = action.payload;
    })
    .addCase(SetCameraTargetAction, (state, action: PayloadAction<SpaceTarget>) => {
      state.cameraState.spaceTarget = action.payload;
      state.cameraState.earthTarget = undefined;
    })
    .addCase(SetEarthTargetAction, (state, action: PayloadAction<GeoCoordinates>) => {
      state.cameraState.earthTarget = {
        prevTarget: { lon: 0, lat: 0 },
        nextTarget: action.payload
      }
    })
    .addCase(UpdateEarthTargetAction, (state, action: PayloadAction<GeoCoordinates>) => {
      state.cameraState.earthTarget = {
        prevTarget: state.cameraState.earthTarget?.nextTarget,
        nextTarget: action.payload
      }
    })
    .addCase(SetCameraControlsAction, (state, action: PayloadAction<CameraControls>) => {
      state.cameraState.controls = action.payload;
    })
});