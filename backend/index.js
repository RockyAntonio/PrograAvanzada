require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const habitsRoutes = require("./routes/habits");
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api", habitsRoutes);
app.use('/auth', authRoutes);
// /api/api/habits
// Puerto
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error al conectar a MongoDB:", err));
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// URI de MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb+srv://alekschito2003:Y9GUFdJ4tAveHRfC@cluster0.hud9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

mongoose.connection.once('open', () => console.log('🟢 Conectado a MongoDB Atlas'));
mongoose.connection.on('error', (err) => console.error('🔴 Error en la conexión a MongoDB:', err));