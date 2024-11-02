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



// Function to send user ID to backend
export const sendUserId = async (setData, setError) => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');

  if (userId) {
    try {
      const response = await axios.post('https://0319-49-37-9-67.ngrok-free.app/allot', {
        user_id: userId,
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': "any"
        },
      });
      if (response.data && response.data.names) {
        setData(response.data.names);
      } else {
        setError('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error sending User ID:', error);
    }
  }
};

// Function to fetch options from Rails API
export const fetchData = async (setData, setError) => {
  try {
    const response = await axios.get('https://0319-49-37-9-67.ngrok-free.app/allot', {
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': "any"
      },
    });
    if (Array.isArray(response.data.names) && response.data.names.every(item => Array.isArray(item) && item.length === 2)) {
      setData(response.data.names);
    } else {
      console.error('Unexpected data structure:', response.data.names);
      setError('Invalid data format received.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    setError('Error fetching data. Please check the console for more details.');
  }
};

// Function to fetch allottee data
export const fetchAllottee = async (setAllottee, setError) => {
  try {
    const response = await axios.get('https://0319-49-37-9-67.ngrok-free.app/task_data', {
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': "any"
      },
    });
    console.log(response.data.personnels);
    setAllottee(response.data.personnels);
  } catch (error) {
    console.error('Error fetching data:', error);
    setError('Error fetching data. Please check the console for more details.');
  }
};
