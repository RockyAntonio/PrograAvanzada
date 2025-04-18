// frontend/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./habitsSlice";
import authReducer from "./authSlice"; // 🔥 AÑADIDO

const store = configureStore({
  reducer: {
    habits: habitsReducer,
    auth: authReducer, // 🔥 REGISTRADO
  },
});

export default store;
