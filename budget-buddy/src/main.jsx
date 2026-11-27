import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BudgetProvider } from './context/BudgetContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BudgetProvider>
      <App />
    </BudgetProvider>
  </React.StrictMode>
)
