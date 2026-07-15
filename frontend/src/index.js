import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { API_BASE_URL } from './config';

const LOCAL_API_URL = 'http://localhost:8000';

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith(LOCAL_API_URL)) {
    config.url = config.url.replace(LOCAL_API_URL, API_BASE_URL);
  }
  return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
        </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
