// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "El usuario ya existe" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = router;


// backend/routes/habits.js
const mongoose = require("mongoose");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");

// Completar hábito y actualizar racha
router.patch("/:id/done", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const habit = await Habit.findById(new mongoose.Types.ObjectId(id));

        if (!habit) {
            return res.status(404).json({ message: "Hábito no encontrado" });
        }

        const today = new Date().toISOString().split("T")[0];
        const lastCompleted = habit.lastCompleted ? habit.lastCompleted.toISOString().split("T")[0] : null;

        if (lastCompleted === today) {
            return res.status(400).json({ message: "Ya completaste este hábito hoy." });
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastCompleted === yesterdayStr) {
            habit.streak += 1;
        } else {
            habit.streak = 1;
        }

        habit.completedDays += 1;
        habit.lastCompleted = new Date();

        await habit.save();
        res.json({ message: "Hábito marcado como completado", habit });
    } catch (error) {
        res.status(500).json({ message: "Error al marcar hábito", error: error.message });
    }
});

module.exports = router;
