import { BrowserRouter } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { PlanDataProvider } from './contexts/PlanDataProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
import './App.css'

// Point d'entrée React : encapsule toute l'app dans un BrowserRouter afin de gérer la navigation SPA.
// C'est ici que l'on branche notre layout principal qui contient toutes les pages et modales.

function App() {
  return (
    <BrowserRouter>
      {/* Context de données statiques partagé par toute l'application */}
      <PlanDataProvider>
        <ThemeProvider>
          {/* Layout principal gérant routes + modales */}
          <AppLayout />
        </ThemeProvider>
      </PlanDataProvider>
    </BrowserRouter>
  )
}

export default App
