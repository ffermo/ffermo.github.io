import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./space.store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const selectSpaceState = (state: RootState) => state.spaceState;
export const selectCameraState = (state: RootState) => state.spaceState.cameraState;
export const selectCameraTarget = (state: RootState) => state.spaceState.cameraState.target;
export const selectCameraControls = (state: RootState) => state.spaceState.cameraState.controls;
