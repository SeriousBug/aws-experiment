import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authSlice } from "./auth";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  middleware: [
    // Log all actions for debugging
    (store: any) => (next: any) => (action: any) => {
      console.group(action?.type);
      console.info("dispatching", action);
      const result = next(action);
      console.log("next state", store.getState());
      console.groupEnd();
      return result;
    },
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Added to get Typescript to recognize the right type with `typeof ...`
const useAppDispatchWrap = () => useDispatch<AppDispatch>();
export const useAppDispatch: typeof useAppDispatchWrap = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
