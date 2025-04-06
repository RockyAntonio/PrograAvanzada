const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },

  // Nuevos campos para seguimiento de hábitos
  diasSeguidos: { type: Number, default: 0 },             // Racha de días consecutivos
  completedDates: [{ type: Date, default: [] }],          // Lista de fechas completadas
  lastCompletedDate: { type: Date, default: null },       // Última fecha en la que se completó
  progreso: { type: Number, default: 0 },                 // % del hábito (0-100)

  // Campos anteriores (por si los quieres mantener)
  streak: { type: Number, default: 0 },                   // Puedes eliminar si duplicado
  completedDays: { type: Number, default: 0 },            // No necesario si usas completedDates.length
  lastCompleted: { type: Date, default: null }            // Puedes eliminar si usas lastCompletedDate
});

const Habit = mongoose.model("Habit", HabitSchema);

module.exports = Habit;
