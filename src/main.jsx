import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import router from './router';
import './index.css';

// Add Axios default config for API calls
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.PROD ? '/' : 'http://localhost:5000';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
