import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// Set default baseURL for Axios to Render production backend URL
const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://real-state-backend-g6nt.onrender.com';
if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
