const mongoose = require('mongoose');
const Habit = require('./models/Habit'); 

const HabitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', HabitSchema);
