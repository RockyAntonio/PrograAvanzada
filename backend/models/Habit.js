const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    streak: { type: Number, default: 0 },
    completedDays: { type: Number, default: 0 },
    lastCompleted: { type: Date, default: null }
});

const Habit = mongoose.model("Habit", HabitSchema);

module.exports = Habit;
