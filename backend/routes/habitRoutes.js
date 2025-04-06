// ✅ routes/habitRoutes.js (unificados y reorganizados)
const express = require("express");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");
const { isToday } = require("date-fns");
const router = express.Router();

// GET: Obtener todos los hábitos del usuario
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo hábitos" });
  }
});

// POST: Crear nuevo hábito
router.post("/", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "El nombre del hábito es requerido" });

  try {
    const newHabit = new Habit({
      name,
      userId: req.user.id,
      streak: 0,
      completed: false,
      completedToday: false,
      lastCompletedDate: null,
    });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: "Error creando hábito" });
  }
});

// PATCH: Marcar hábito como completado
router.patch("/:id/done", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });

    const today = new Date();
    const lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null;

    if (lastCompleted && isToday(lastCompleted)) {
      return res.status(400).json({ message: "Ya completaste este hábito hoy." });
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const continuedStreak = lastCompleted && lastCompleted.toDateString() === yesterday.toDateString();
    habit.streak = continuedStreak ? habit.streak + 1 : 1;

    habit.lastCompletedDate = today;
    habit.completedToday = true;

    await habit.save();
    res.json({ message: "Hábito completado", habit });
  } catch (error) {
    console.error("Error en PATCH /:id/done:", error);
    res.status(500).json({ message: "Error al actualizar hábito" });
  }
});

// PATCH: Reset diario
router.patch("/reset-daily", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.find({ userId });

    const updatedHabits = await Promise.all(
      habits.map(async (habit) => {
        if (habit.lastCompletedDate && isToday(new Date(habit.lastCompletedDate))) {
          return habit;
        }
        habit.completedToday = false;
        habit.lastCompletedDate = null;
        return await habit.save();
      })
    );

    res.json({ updatedHabits });
  } catch (error) {
    console.error("Error en reset-daily:", error);
    res.status(500).json({ message: "Error al reiniciar hábitos" });
  }
});

// DELETE: Eliminar hábito
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });
    res.json({ message: "Hábito eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando hábito" });
  }
});

// routes/habitRoutes.js
router.put('/:id/done', async (req, res) => {
    try {
      const habit = await Habit.findById(req.params.id);
  
      if (!habit) return res.status(404).json({ message: 'Hábito no encontrado' });
  
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Ignoramos la hora para comparar por día
  
      // Ya fue marcado hoy
      const alreadyCompletedToday = habit.completedDates.some(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
  
      if (alreadyCompletedToday) {
        return res.status(400).json({ message: 'Hábito ya fue marcado como hecho hoy' });
      }
  
      // Verificamos si la última vez fue ayer para continuar la racha
      let diasSeguidos = 1;
      if (habit.lastCompletedDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
  
        const lastDate = new Date(habit.lastCompletedDate);
        lastDate.setHours(0, 0, 0, 0);
  
        if (lastDate.getTime() === yesterday.getTime()) {
          diasSeguidos = habit.diasSeguidos + 1;
        }
      }
  
      habit.completedDates.push(today);
      habit.lastCompletedDate = today;
      habit.diasSeguidos = diasSeguidos;
      habit.progreso = Math.min(Math.floor((diasSeguidos / 66) * 100), 100);
  
      await habit.save();
  
      res.status(200).json(habit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al marcar hábito como hecho' });
    }
  });
  

module.exports = router;