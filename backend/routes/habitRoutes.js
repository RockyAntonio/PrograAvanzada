const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getHabits } = require("../controllers/habitController");

const {
  createHabit,
  toggleHabitDone,
  resetDailyHabits,
  deleteHabit
} = require("../controllers/habitController");

// GET: Obtener todos los hábitos del usuario
router.get("/", authMiddleware, getHabits);

// POST: Crear nuevo hábito
router.post("/", authMiddleware, createHabit);

// PATCH: Marcar hábito como completado
router.patch("/:id/done", authMiddleware, toggleHabitDone);

// PATCH: Reset diario
router.patch("/reset-daily", authMiddleware, resetDailyHabits);

// DELETE: Eliminar hábito
router.delete("/:id", authMiddleware, deleteHabit);

module.exports = router;
