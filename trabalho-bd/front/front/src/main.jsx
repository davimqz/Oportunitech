import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import React from 'react';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </React.StrictMode>
)
