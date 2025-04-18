// frontend/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

let initialToken = null;

// Evitar errores con localStorage durante SSR
if (typeof window !== "undefined") {
  initialToken = localStorage.getItem("token");
}

const initialState = {
  token: initialToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },
    logout: (state) => {
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
