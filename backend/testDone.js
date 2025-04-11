const mongoose = require('mongoose');
const Habit = require('./models/Habit');

mongoose.connect('mongodb+srv://alekschito2003:Y9GUFdJ4tAveHRfC@cluster0.hud9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

async function marcarDone() {
  try {
    const habit = await Habit.findById('67df57a7728d51048241ff2b');
    if (!habit) throw new Error('Hábito no encontrado');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCompletedToday = habit.completedDates.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (alreadyCompletedToday) {
      console.log('Ya fue marcado como hecho hoy.');
      return;
    }

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
    console.log('✅ Hábito actualizado:', habit);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

marcarDone();
