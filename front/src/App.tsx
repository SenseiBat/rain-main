import { BrowserRouter } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { PlanDataProvider } from './contexts/PlanDataProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
import './App.css'

/**
 * Composant racine de l'application Rain (Site Documentaire VTOM)
 * 
 * Ce composant initialise l'architecture de l'application en encapsulant
 * toute l'interface dans les providers nécessaires et le routeur.
 * 
 * Architecture des providers (de l'extérieur vers l'intérieur) :
 * 1. BrowserRouter : Gestion de la navigation SPA (Single Page Application)
 * 2. PlanDataProvider : Fournit les données du plan VTOM à toute l'application
 * 3. ThemeProvider : Gère le thème clair/sombre de l'application
 * 4. AppLayout : Composant principal contenant les routes, pages et modales
 * 
 * Cette structure permet :
 * - Une navigation sans rechargement de page
 * - Un accès global aux données du plan VTOM
 * - Un changement de thème cohérent sur toute l'application
 * - Une séparation claire des responsabilités
 */
function App() {
  return (
    <BrowserRouter>
      {/* 
        PlanDataProvider charge et expose les données du plan VTOM (plan-data.json)
        Accessible via le hook usePlanData() dans tous les composants enfants
      */}
      <PlanDataProvider>
        {/* 
          ThemeProvider gère le thème (clair/sombre) avec persistance localStorage
          Accessible via le hook useTheme() dans tous les composants enfants
        */}
        <ThemeProvider>
          {/* 
            AppLayout contient la structure principale :
            - Hero (bandeau de navigation)
            - Routes (Home, Documentation, Plan VTOM, Vtom JSON)
            - Modales (Recherche, Cookies)
            - Footer
          */}
          <AppLayout />
        </ThemeProvider>
      </PlanDataProvider>
    </BrowserRouter>
  )
}

export default App
