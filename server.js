require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Cargar la URL de conexión desde .env
const MONGO_URI = process.env.MONGO_URI;

// Conectar a MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("🟢 Conectado a MongoDB"))
.catch(err => console.error("🔴 Error al conectar a MongoDB:", err));

app.get('/', (req, res) => {
    res.send('¡Servidor funcionando con MongoDB!');
});

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


//importacion de las rutas
const habitRoutes = require('./routes/habits');
app.use('/api/habits', habitRoutes);

app.get("/habits", async (req, res) => {
    try {
      const habits = await Habit.find();  // Asegúrate de que Habit está importado
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los hábitos", error });
    }
  });
  