import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Obtener hábitos
export const fetchHabits = createAsyncThunk("habits/fetchHabits", async (token, { rejectWithValue }) => {
  try {
    const res = await fetch("http://localhost:5000/api/habits", {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue(data.message);
    }
    return data;
  } catch (error) {
    return rejectWithValue("Error al obtener hábitos");
  }
});

// Eliminar hábito
export const deleteHabit = createAsyncThunk("habits/deleteHabit", async ({ id, token }, { rejectWithValue }) => {
  try {
    const res = await fetch(`http://localhost:5000/api/habits/${id}`, { 
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue(data.message);
    }
    return id;
  } catch (error) {
    return rejectWithValue("Error al eliminar hábito");
  }
});

// Marcar hábito como completado
export const toggleHabitCompletion = createAsyncThunk(
  "habits/toggleHabitCompletion",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/habits/${id}/done`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({}) // cuerpo vacío
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message);
      }
      return data.habit;
    } catch (error) {
      return rejectWithValue("Error al actualizar hábito");
    }
  }
);

// 🔁 Reiniciar hábitos del día (nuevo thunk)
export const resetDailyHabits = createAsyncThunk(
  "habits/resetDailyHabits",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/habits/reset-daily", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message);
      }
      return data.updatedHabits; // array de hábitos actualizados
    } catch (error) {
      return rejectWithValue("Error al reiniciar hábitos");
    }
  }
);

const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.list = state.list.filter((habit) => habit._id !== action.payload);
      })
      .addCase(toggleHabitCompletion.fulfilled, (state, action) => {
        const index = state.list.findIndex((habit) => habit._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // 💥 Nuevo handler para resetDailyHabits
      .addCase(resetDailyHabits.fulfilled, (state, action) => {
        // Reemplazamos los hábitos con la nueva lista reseteada
        action.payload.forEach(updatedHabit => {
          const index = state.list.findIndex(h => h._id === updatedHabit._id);
          if (index !== -1) {
            state.list[index] = updatedHabit;
          }
        });
      });
  },
});

export default habitsSlice.reducer;
