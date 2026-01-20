/**
 * Point d'entrée centralisé pour tous les hooks personnalisés de l'application
 * Permet d'importer les hooks depuis un seul endroit : import { usePlanData, useTheme } from '../hooks'
 */

// Hook pour accéder aux données du plan VTOM (colonnes, paysage, détails)
export { usePlanData } from './usePlanData'

// Hook pour tester la connexion avec le backend Laravel
export { useBackendMessage } from './useBackendMessage'

// Hook pour gérer les cookies de manière sécurisée
export { useCookie } from './useCookie'

// Hook pour récupérer la liste des environnements VTOM
export { useVtomEnvironments } from './useVtomEnvironments'

// Hook pour récupérer les applications d'un environnement VTOM spécifique
export { useVtomApplications } from './useVtomApplications'

// Hook pour récupérer la liste des utilisateurs VTOM
export { useVtomUsers } from './useVtomUsers'

