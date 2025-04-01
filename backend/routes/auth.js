const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User"); // Asegúrate de que el modelo existe
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Configuración de CORS específica para este router
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true"); // Habilitar credenciales
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Manejar preflight requests
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
  
    next();
  });  

// 📌 REGISTRO DE USUARIOS
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error: error.message });
  }
});

// 📌 INICIO DE SESIÓN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Credenciales inválidas" });

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Credenciales inválidas" });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error: error.message });
  }
});

// 📌 OBTENER HÁBITOS (requiere autenticación)
router.get("/habits", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener hábitos" });
  }
});

// 📌 CREAR HÁBITO (requiere autenticación)
router.post("/habits", authMiddleware, async (req, res) => {
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

// 📌 MARCAR HÁBITO COMO COMPLETADO (requiere autenticación)
router.patch("/habits/:id/done", authMiddleware, async (req, res) => {
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

// 📌 ELIMINAR HÁBITO (requiere autenticación)
router.delete("/habits/:id", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });

    res.json({ message: "Hábito eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando hábito" });
  }
});

module.exports = router;
