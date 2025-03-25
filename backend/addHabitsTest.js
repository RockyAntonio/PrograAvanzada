const mongoose = require("mongoose");
const Habit = require("./models/Habit"); // ✅ CORRECTO

// Conexión a MongoDB (Cambia la URL si usas MongoDB Atlas)
const mongoURI = "mongodb+srv://alekschito2003:Y9GUFdJ4tAveHRfC@cluster0.hud9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Reemplaza con tu DB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Función para agregar hábitos
const addHabitsTest = async () => {
  try {
    const Habits = [
      { name: "Ejercicio", frequency: "daily" },
      { name: "Leer", frequency: "weekly" },
      { name: "Meditar", frequency: "daily" },
    ];

    // Insertar en la base de datos
    const insertedHabits = await Habit.insertMany(Habits);
    console.log("Hábitos agregados:", insertedHabits);
  } catch (error) {
    console.error("Error al agregar hábitos:", error);
  } finally {
    mongoose.connection.close(); // Cierra la conexión después de insertar
  }
};

// Ejecutar la función
addHabitsTest();

