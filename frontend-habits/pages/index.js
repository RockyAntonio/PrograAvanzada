// frontend-habits/pages/index.js

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // detectar si estamos en el cliente

  useEffect(() => {
    setIsClient(true); // se activa solo en cliente
  }, []);

  const isAuthenticated = useSelector((state) => !!state.auth.token);

  useEffect(() => {
    if (!isClient) return;
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, isClient]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">¡Bienvenido a tu gestor de hábitos! 🧠</h1>
      <p className="text-lg">Tu camino hacia hábitos atómicos comienza aquí.</p>
    </div>
  );
}
