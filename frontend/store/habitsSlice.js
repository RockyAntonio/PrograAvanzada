import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  const res = await fetch('http://localhost:5000/habits');
  return await res.json();
});

const habitsSlice = createSlice({
  name: 'habits',
  initialState: { habits: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default habitsSlice.reducer;
