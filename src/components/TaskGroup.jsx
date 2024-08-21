import React from 'react';
import TaskCard from './TaskCard';
import './taskgroup.css';

const TaskGroup = ({ tasks, style, onToggleComplete }) => {
  // Separate completed and incomplete tasks
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="task-group" style={style}>
      {incompleteTasks.map(task => (
        <TaskCard key={task.id} task={task} onToggleComplete={onToggleComplete} />
      ))}
      {completedTasks.map(task => (
        <TaskCard key={task.id} task={task} onToggleComplete={onToggleComplete} />
      ))}
    </div>
  );
};

export default TaskGroup;
