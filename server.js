require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://progra-avanzada.vercel.app", // dominio final en Vercel
  "https://progra-avanzada-o6a3zdxcc-rockyantonios-projects.vercel.app/"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch((err) => console.error("🔴 Error al conectar a MongoDB:", err));

// Rutas
const habitRoutes = require("./routes/habits");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Solo si usas esta ruta manualmente:
const Habit = require("./models/Habit"); // Asegúrate de que existe
app.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los hábitos", error });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
