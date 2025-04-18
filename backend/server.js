require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://progra-avanzada.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🟢 Conectado a MongoDB"))
.catch((err) => console.error("🔴 Error al conectar a MongoDB:", err));

// Rutas
app.get("/", (req, res) => {
  res.send("Servidor frontend funcionando correctamente 🚀");
});

const PORT_FINAL = process.env.PORT || 3000;
app.listen(PORT_FINAL, () => {
  console.log(`🚀 Servidor frontend corriendo en http://localhost:${PORT_FINAL}`);
});
