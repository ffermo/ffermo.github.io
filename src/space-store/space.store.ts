import { configureStore } from "@reduxjs/toolkit";
import { spaceReducer } from "./space.reducer";

export const store = configureStore({
  reducer: {
    spaceState: spaceReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export default store;