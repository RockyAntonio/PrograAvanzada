import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function HomeContent() {
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
      <h1 className="text-4xl font-bold mb-4">¡Bienvenido a tu gestor de hábitos! 🧠</h1>
      <p className="text-lg">Tu camino hacia hábitos atómicos comienza aquí.</p>
    </div>
  );
}
