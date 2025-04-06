import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabits, deleteHabit, toggleHabitCompletion } from "../store/habitsSlice";

const HabitList = () => {
  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habits.list);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Cargar hábitos cuando el componente se monta
  useEffect(() => {
    if (token) {
      dispatch(fetchHabits(token));
    }
  }, [token, dispatch]);

  // Calcular el progreso basado en streaks
  const totalHabits = habits.length;
  const totalProgress = habits.reduce((acc, habit) => acc + Math.min(habit.streak / 66, 1), 0);
  const averageProgress = totalHabits > 0 ? (totalProgress / totalHabits) * 100 : 0;

  // Determinar el color dinámico de la barra
  const getProgressColor = () => {
    if (averageProgress < 34) return "bg-red-500";
    if (averageProgress < 66) return "bg-yellow-400";
    return "bg-green-500";
  };

  // Marcar hábito como completado
  const handleDone = async (id) => {
    try {
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/habits/${id}/done`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error en PATCH:", data);
        return;
      }

      dispatch(toggleHabitCompletion({ id, token }));
    } catch (error) {
      console.error("Error al marcar hábito como completado", error);
    }
  };

  // Eliminar hábito
  const handleDelete = (id) => {
    if (!token) return;
    dispatch(deleteHabit({ id, token }));
  };

  return (
    <div className="mt-2">
      <h2 className="text-lg font-bold mb-2">Mis Hábitos</h2>

      {/* Barra de progreso general */}
      <div className="w-full bg-gray-200 rounded-full h-6 mb-4 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-in-out ${getProgressColor()}`}
          style={{ width: `${averageProgress}%` }}
        ></div>
        <span className="absolute inset-0 flex justify-center items-center text-black font-bold text-sm">
          Progreso general: {Math.round(averageProgress)}%
        </span>
      </div>

      {/* Lista de hábitos */}
      <ul>
        {habits.map((habit) => (
          <li key={habit._id} className="flex justify-between p-2 border-b">
            <span className={habit.completed ? "line-through text-gray-500" : ""}>
              {habit.name} <span className="text-sm text-blue-500">({habit.streak} días)</span>
            </span>
            <div>
              <button
                onClick={() => handleDone(habit._id)}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Done
              </button>
              <button
                onClick={() => handleDelete(habit._id)}
                className="text-red-500"
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitList;
