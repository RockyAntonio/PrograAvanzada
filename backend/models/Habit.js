const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },

  diasSeguidos: { type: Number, default: 0 },
  completedDates: [{ type: Date }],
  lastCompletedDate: { type: Date, default: null },
  progreso: { type: Number, default: 0 },

  // Opcional: si ya no usas estos campos, puedes quitarlos
  completedToday: { type: Boolean, default: false },
  streak: { type: Number, default: 0 }
});

const Habit = mongoose.model("Habit", HabitSchema);
module.exports = Habit;

