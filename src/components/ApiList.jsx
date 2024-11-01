import axios from 'axios';

export const handleCheckboxChange = async (taskId, isChecked, setAllottee) => {
  try {
    const response = await axios.post('https://0319-49-37-9-67.ngrok-free.app/done_mark', {
      task_id: taskId,
      completed: isChecked,
    });

    if (response.data.success) {
      setAllottee((prevAllottee) => {
        const updatedAllottee = { ...prevAllottee };
        for (const [allotteeName, tasks] of Object.entries(updatedAllottee)) {
          const taskIndex = tasks.findIndex(task => task[0] === taskId);
          if (taskIndex !== -1) {
            updatedAllottee[allotteeName][taskIndex][2] = isChecked;
          }
        }
        return updatedAllottee;
      });
    } else {
      console.error('Failed to update task status:', response.data.errors);
    }
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};
