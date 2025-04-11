// server.js
require("dotenv").config();
const express = require("express");
// ...
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habitRoutes");

const app = express();

// Middleware de logs
app.use((req, res, next) => {
  console.log(`📢 Petición recibida: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Middleware
const allowedOrigins = [
  "http://localhost:3000",            // Desarrollo local
  "https://tu-frontend.vercel.app"    // Producción en Vercel (¡reemplaza esto cuando lo tengas!)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman) o desde orígenes permitidos
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("⛔ No permitido por CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error en MongoDB:", err));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/habits", require("./routes/habitRoutes"));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
