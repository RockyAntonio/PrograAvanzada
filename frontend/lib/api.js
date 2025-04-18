// frontend/lib/api.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async ({ email, password }) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error de conexión con el servidor");
  }
};


export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Error al registrar usuario");
  }

  return data;
};
