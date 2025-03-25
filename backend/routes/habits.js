const express = require("express");
const mongoose = require('mongoose');
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware"); // Importa el middleware

const router = express.Router(); 

router.get("/habits", async (req, res) => {
    try {
      const habits = await Habit.find();
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener hábitos" });
    }
  });

// Obtener hábitos (PROTEGIDO)
router.get("/obtener", authMiddleware, async (req, res) => {
    try {
        const habits = await Habit.find();
        res.json(habits);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener hábitos" });
    }
});

// Crear hábito (PROTEGIDO)
router.post("/registro", authMiddleware, async (req, res) => {
    const { name, frequency } = req.body;

    try {
        const habit = new Habit({ name, frequency, completedDays: 0 });
        await habit.save();
        res.json({ message: "Hábito creado", habit });
    } catch (err) {
        res.status(500).json({ message: "Error al crear hábito" });
    }
});

// Eliminar hábito (PROTEGIDO)
router.delete("/:id", authMiddleware, async (req, res) => { 
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: "Hábito eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar hábito" });
    }
});


//ruta patch

router.patch("/:id/done", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const habit = await Habit.findById(new mongoose.Types.ObjectId(id)); //corregido 2 veces

        if (!habit) {
            return res.status(404).json({ message: "Hábito no encontrado" });
        }

        const today = new Date().toISOString().split("T")[0]; // Fecha en formato YYYY-MM-DD
        const lastCompleted = habit.lastCompleted ? habit.lastCompleted.toISOString().split("T")[0] : null;

        if (lastCompleted === today) {
            return res.status(400).json({ message: "Ya completaste este hábito hoy." });
        }

        // Verificar si la última fecha completada fue ayer para continuar la racha
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastCompleted === yesterdayStr) {
            habit.streak += 1;  // Aumentar la racha
        } else {
            habit.streak = 1;  // Reiniciar racha
        }

        habit.completedDays += 1;
        habit.lastCompleted = new Date();

        await habit.save();
        res.json({ message: "Hábito marcado como completado", habit });
    } catch (error) {
        console.error(error); // Muestra el error en la terminal
        res.status(500).json({ message: "Error al marcar hábito", error: error.message }); // Muestra el mensaje del error
    }
});

module.exports = router;