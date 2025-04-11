import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// URL base desde variable de entorno
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener hábitos
export const fetchHabits = createAsyncThunk("habits/fetchHabits", async (token, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/habits`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
    return data;
  } catch (error) {
    return rejectWithValue("Error al obtener hábitos");
  }
});

// Eliminar hábito
export const deleteHabit = createAsyncThunk("habits/deleteHabit", async ({ id, token }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/habits/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
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
      const res = await fetch(`${BASE_URL}/api/habits/${id}/done`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data.habit;
    } catch (error) {
      return rejectWithValue("Error al actualizar hábito");
    }
  }
);

// Reiniciar hábitos del día
export const resetDailyHabits = createAsyncThunk(
  "habits/resetDailyHabits",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/api/habits/reset-daily`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data.updatedHabits;
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
      .addCase(resetDailyHabits.fulfilled, (state, action) => {
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
