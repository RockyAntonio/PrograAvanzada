import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Importamos authSlice

const store = configureStore({
  reducer: {
    auth: authReducer, // Agregamos auth al store global
  },
});

export default store;
