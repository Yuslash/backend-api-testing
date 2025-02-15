import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:9000', // Your Medusa backend URL
  headers: {
    'Content-Type': 'application/json',
    'x-publishable-api-key': 'pk_75720c9260a94f73405bd72aa5b52f76229f58e08ab0ffd3c1143d80bc130937', // Add your publishable API key here
  },
});

export default axiosInstance;
