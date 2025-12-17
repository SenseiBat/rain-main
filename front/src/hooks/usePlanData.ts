import { useContext } from 'react'
import { PlanDataContext } from '../contexts/PlanDataProvider'

// Hook utilitaire pour accéder au contexte du plan VTOM.
export function usePlanData() {
  const context = useContext(PlanDataContext)
  if (!context) {
    throw new Error('usePlanData must be used within PlanDataProvider')
  }
  return context
}
