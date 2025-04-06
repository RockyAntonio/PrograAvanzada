const mongoose = require("mongoose");
const Habit = require("./models/Habit");

mongoose.connect("mongodb+srv://alekschito2003:Y9GUFdJ4tAveHRfC@cluster0.hud9r.mongodb.net/habits?retryWrites=true&w=majority&appName=Cluster0");

Habit.find()
  .then((habits) => {
    console.log(`Total de hábitos encontrados: ${habits.length}`);
    if (habits.length === 0) {
      console.log("⚠️ No hay hábitos registrados en la base de datos.");
    } else {
      console.log("Hábitos encontrados:");
      habits.forEach((h) => {
        console.log(`🆔 ID: ${h._id} | Nombre: ${h.name}`);
      });
    }
    mongoose.disconnect();
  })
