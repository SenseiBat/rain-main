import { useContext } from 'react'
import { PlanDataContext } from '../contexts/PlanDataProvider'

/**
 * Hook personnalisé pour accéder aux données du plan VTOM
 * 
 * Fournit un accès sécurisé au contexte PlanData qui contient :
 * - planData: Toutes les données du plan (colonnes, paysage, détails)
 * - planApplications: Liste aplatie des applications pour la recherche
 * - getAppDetail: Fonction pour récupérer les détails d'une application
 * - updatePlanData: Fonction pour mettre à jour les données (import XML)
 * - resetPlanData: Fonction pour réinitialiser aux données par défaut
 * 
 * @throws {Error} Si utilisé en dehors d'un PlanDataProvider
 * @returns {PlanDataContextValue} L'objet contexte contenant les données et fonctions du plan
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { planData, getAppDetail } = usePlanData()
 *   const appDetails = getAppDetail('MyApp')
 *   return <div>{appDetails.name}</div>
 * }
 * ```
 */
export function usePlanData() {
  const context = useContext(PlanDataContext)
  
  // Vérification de sécurité : le hook ne peut être utilisé que dans un composant
  // enveloppé par PlanDataProvider
  if (!context) {
    throw new Error('usePlanData must be used within PlanDataProvider')
  }
  
  return context
}
