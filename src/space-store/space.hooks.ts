import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./space.store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const selectSpaceState = (state: RootState) => state.spaceState;
export const selectCameraState = (state: RootState) => state.spaceState.cameraState;
export const selectSpaceTarget = (state: RootState) => state.spaceState.cameraState.spaceTarget;
export const selectEarthTarget = (state: RootState) => state.spaceState.cameraState.earthTarget;
export const selectCurrentEarthTarget = (state: RootState) => state.spaceState.cameraState.earthTarget?.nextTarget;
export const selectCameraControls = (state: RootState) => state.spaceState.cameraState.controls;
