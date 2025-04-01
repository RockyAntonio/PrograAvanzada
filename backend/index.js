require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB Atlas
connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Permite solo el frontend
    credentials: true, // Permite el envío de cookies y encabezados de autenticación
  })
);

app.use(express.json()); // Para procesar JSON en las solicitudes

// Rutas
app.use("/auth", require("./routes/auth"));
app.use("/api/habits", require("./routes/habitRoutes"));

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

