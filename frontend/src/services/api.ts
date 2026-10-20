import axios from 'axios';

// Config to point to your running FastAPI backend server port (e.g., 8000 or 8010)
const API = axios.create({
  baseURL: 'http://127.0.0.1:8010/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
