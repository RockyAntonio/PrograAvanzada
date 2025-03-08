const express = require('express');
const Habit = require('../backend/models/Habit');
const router = express.Router();

// Crear un nuevo hábito
router.post('/', async (req, res) => {
    try {
        const { name, userId } = req.body;
        const habit = new Habit({ name, userId });
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los hábitos de un usuario
router.get('/:userId', async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.params.userId });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Marcar hábito como completado
router.put('/:id', async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });

        // Actualizar progreso y última fecha de actualización
        habit.progress += 1;
        habit.lastUpdated = new Date();
        await habit.save();

        res.json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un hábito
router.delete('/:id', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hábito eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
