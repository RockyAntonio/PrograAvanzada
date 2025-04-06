import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // Guardar token en localStorage
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token"); // Eliminar token al cerrar sesión
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
