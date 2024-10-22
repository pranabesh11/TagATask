import axios from 'axios';

const BASE_URL = 'https://b791-49-37-9-67.ngrok-free.app';

export const sendUserId = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/allot`, { user_id: userId }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'any',
      },
    });
    return response.data.names;
  } catch (error) {
    console.error('Error sending User ID:', error);
    throw error;
  }
};

export const fetchAllottees = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/allot`, {
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'any',
      },
    });
    return response.data.names;
  } catch (error) {
    console.error('Error fetching allotments:', error);
    throw error;
  }
};
