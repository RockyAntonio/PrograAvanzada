import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../lib/api"; // importa la función

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });

      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);

      // Redirigir a dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Iniciar Sesión</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block font-semibold">Correo Electrónico</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Contraseña</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
