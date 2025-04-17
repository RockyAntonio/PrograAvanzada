export const getToken = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("📦 Token desde localStorage:", token); // 👈 AGREGA ESTO
    return token;
  }
  return null;
};
