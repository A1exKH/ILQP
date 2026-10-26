import axios from 'axios';

// Dynamically determine the backend URL based on where the app is loaded
const getApiBaseUrl = () => {
  // If you are running locally 
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8010';
  }
  
  // If you are running in production on Vercel (or any other live domain)
  return 'https://ilqp-backend-278271061546.us-central1.run.app';
};

const API = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;