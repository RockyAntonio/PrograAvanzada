const express = require("express");
const mongoose = require("mongoose");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro" });
  }
});


// Obtener todos los hábitos (requiere autenticación)
router.get("/api/habits", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }); // Filtra hábitos por usuario
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener hábitos" });
  }
});

// Crear un hábito (requiere autenticación)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newHabit = new Habit({
      ...req.body,
      userId: req.user.id,
    });
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(500).json({ message: "Error al crear hábito" });
  }
});

// Marcar hábito como completado
router.patch("/:id/done", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findById(new mongoose.Types.ObjectId(id));

    if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });

    const today = new Date().toISOString().split("T")[0];
    const lastCompleted = habit.lastCompleted ? habit.lastCompleted.toISOString().split("T")[0] : null;

    if (lastCompleted === today) {
      return res.status(400).json({ message: "Ya completaste este hábito hoy." });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    habit.streak = lastCompleted === yesterdayStr ? habit.streak + 1 : 1;
    habit.completedDays += 1;
    habit.lastCompleted = new Date();

    await habit.save();
    res.json({ message: "Hábito completado", habit });
  } catch (error) {
    res.status(500).json({ message: "Error al marcar hábito", error: error.message });
  }
});

// Actualizar un hábito (requiere autenticación)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHabit = await Habit.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedHabit) return res.status(404).json({ message: "Hábito no encontrado" });
    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar hábito", error: error.message });
  }
});

// Eliminar hábito (requiere autenticación)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });

    res.json({ message: "Hábito eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando hábito" });
  }
});

module.exports = router;
