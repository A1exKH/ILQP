import axios from 'axios';

// Automatically picks up VITE_API_URL from Vercel in production, 
// or falls back to your local port (8010) during local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8010';

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;