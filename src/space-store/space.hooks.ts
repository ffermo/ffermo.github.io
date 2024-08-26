import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./space.store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const selectSpaceState = (state: RootState) => state.spaceState;
export const selectCameraTarget = (state: RootState) => state.spaceState.cameraTarget;
