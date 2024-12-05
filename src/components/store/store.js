import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../slices/Taskslice';

const store = configureStore({
  reducer: {
    task: taskReducer,
  },
});

export default store;
