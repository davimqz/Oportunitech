import './index.css'
import './css/Header.css'
import './css/Graficos.css'
import './css/jbdc.css'
import './css/footer.css'
import './css/Vagas.css'
import './css/Visualizar.css'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App.jsx'

 

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </React.StrictMode>
)
