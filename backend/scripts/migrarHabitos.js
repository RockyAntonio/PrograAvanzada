// scripts/migrarHabitos.js
require("dotenv").config();
const mongoose = require("mongoose");
const Habit = require("../models/Habit");

async function migrarHabitos() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Conectado a MongoDB");

    const habits = await Habit.find({});
    let actualizados = 0;

    for (let habit of habits) {
      let modificado = false;

      if (habit.diasSeguidos === undefined) {
        habit.diasSeguidos = 0;
        modificado = true;
      }

      if (!Array.isArray(habit.completedDates)) {
        habit.completedDates = [];
        modificado = true;
      }

      if (habit.progreso === undefined) {
        habit.progreso = 0;
        modificado = true;
      }

      if (habit.lastCompletedDate === undefined) {
        habit.lastCompletedDate = null;
        modificado = true;
      }

      if (modificado) {
        await habit.save();
        actualizados++;
        console.log(`✅ Hábito "${habit.name}" actualizado`);
      }
    }

    console.log(`🔧 Migración completa. Total actualizados: ${actualizados}`);
  } catch (err) {
    console.error("❌ Error durante la migración:", err);
  } finally {
    mongoose.connection.close();
  }
}

migrarHabitos();
