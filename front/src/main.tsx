import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

/**
 * Point d'entrée JavaScript de l'application
 * 
 * Ce fichier initialise React et monte l'application dans le DOM.
 * Il est chargé par index.html via Vite.
 * 
 * Configuration :
 * - StrictMode : Mode strict de React qui active des vérifications supplémentaires
 *   en développement (détecte les effets de bord, lifecycle deprecated, etc.)
 * - index.css : Styles globaux (reset CSS, variables CSS, typographie Marianne)
 * - root : L'élément DOM où React monte l'application (<div id="root">)
 * 
 * Le '!' après getElementById indique à TypeScript que l'élément existe toujours
 * (car il est défini dans index.html)
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
