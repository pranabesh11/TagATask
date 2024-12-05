import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    editingTask: false,
    tasks: [],
  },
  reducers: {
    setEditingTask: (state, action) => {
      state.editingTask = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const { setEditingTask, setTasks } = taskSlice.actions;
export default taskSlice.reducer;
