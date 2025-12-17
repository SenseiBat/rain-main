import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Initialisation React (root) avec StrictMode pour repérer les effets de bord en dev
// tout en important le CSS global (reset + variables) avant de monter App.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
