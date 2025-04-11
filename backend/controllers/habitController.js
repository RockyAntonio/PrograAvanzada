const Habit = require("../models/Habit");
const { isToday } = require("date-fns");

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo hábitos" });
  }
};

const createHabit = async (req, res) => {
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
      diasSeguidos: 0,
      progreso: 0,
      completedDates: [],
    });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: "Error creando hábito" });
  }
};

const toggleHabitDone = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null;
    if (lastCompleted) lastCompleted.setHours(0, 0, 0, 0);

    if (lastCompleted && isToday(lastCompleted)) {
      return res.status(400).json({ message: "Ya completaste este hábito hoy." });
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const continuedStreak = lastCompleted && lastCompleted.getTime() === yesterday.getTime();
    habit.streak = continuedStreak ? habit.streak + 1 : 1;

    habit.lastCompletedDate = today;
    habit.completedToday = true;

    // Nueva lógica de progreso
    habit.diasSeguidos = continuedStreak ? habit.diasSeguidos + 1 : 1;
    habit.progreso = Math.min(Math.floor((habit.diasSeguidos / 66) * 100), 100);

    // Registrar la fecha como completada
    if (!habit.completedDates) habit.completedDates = [];
    habit.completedDates.push(today);

    await habit.save();
    res.json({ message: "Hábito completado", habit });
  } catch (error) {
    console.error("Error en PATCH /:id/done:", error);
    res.status(500).json({ message: "Error al actualizar hábito" });
  }
};

const resetDailyHabits = async (req, res) => {
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
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });
    res.json({ message: "Hábito eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando hábito" });
  }
};

module.exports = {
  getHabits,
  createHabit,
  toggleHabitDone,
  resetDailyHabits,
  deleteHabit
};
