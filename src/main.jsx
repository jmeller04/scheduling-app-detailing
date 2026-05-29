import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  const savedDarkMode = localStorage.getItem('rmr-dark-mode')
  if (savedDarkMode && JSON.parse(savedDarkMode)) {
    document.documentElement.classList.add('dark')
  }
} catch {
  // Ignore invalid local storage values.
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
