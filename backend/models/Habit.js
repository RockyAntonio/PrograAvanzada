const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    frequency: { type: String, enum: ["daily", "weekly"], required: true },
    completedDays: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },  // Nueva propiedad para racha
    lastCompleted: { type: Date, default: null },  // Última fecha de completado
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Habit', habitSchema);

const Habit = mongoose.model("Habit", habitSchema);
module.exports = Habit;
