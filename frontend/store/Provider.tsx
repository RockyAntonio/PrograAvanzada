"use client"; // Necesario para el contexto de Redux en el cliente

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "./store";

interface ProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: ProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
