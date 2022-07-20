import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
  code?: string;
};

const initialState: AuthState = { code: undefined };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload: { code } }: { payload: AuthState }) => {
      state.code = code;
    },
    logout: (state) => {
      state.code = undefined;
    },
  },
});
