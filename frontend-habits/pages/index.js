// frontend-habits/pages/index.js

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Redirigiendo...</h1>
      <p className="text-lg">Por favor, espera un momento 🌀</p>
    </div>
  );
}
