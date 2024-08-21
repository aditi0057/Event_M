// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1', // Adjust base URL as needed
// });

// export default axiosInstance;

// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Base URL for your API
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Include credentials if needed
});

export default axiosInstance;

