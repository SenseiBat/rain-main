import { useEffect, useState } from 'react'
import { VTOM_API_URL, VTOM_API_KEY } from '../constants'

/**
 * Interface représentant une application VTOM
 * Contient les informations détaillées d'une application (environment, name, comment, frequency, etc.)
 */
interface VtomApplication {
  /** Identifiant unique de l'application */
  id?: string
  /** Nom de l'application */
  name?: string
  /** Propriétés flexibles pour s'adapter à la structure complète de l'API (planning, priority, etc.) */
  [key: string]: unknown
}

/**
 * Structure des données retournées par le hook
 */
interface VtomApplicationsData {
  /** Liste des applications de l'environnement */
  applications: VtomApplication[]
  /** Nombre total d'applications */
  count: number
  /** ID de l'environnement associé */
  environment: string
}

/**
 * Hook personnalisé pour récupérer les applications d'un environnement VTOM spécifique
 * 
 * Effectue un appel à l'API VTOM pour récupérer toutes les applications d'un environnement donné.
 * La requête est re-exécutée si l'ID de l'environnement change.
 * 
 * @param {string} environmentId - ID de l'environnement VTOM (par défaut 'PAY_TOURS')
 * @returns {Object} Un objet contenant:
 *   - data: Les données des applications avec leur environnement (null pendant le chargement)
 *   - isLoading: true pendant le chargement, false après
 *   - error: Message d'erreur en cas d'échec, null sinon
 * 
 * @example
 * ```tsx
 * function ApplicationsList() {
 *   const { data, isLoading, error } = useVtomApplications('PAY_TOURS')
 *   
 *   if (isLoading) return <div>Chargement...</div>
 *   if (error) return <div>Erreur: {error}</div>
 *   
 *   return (
 *     <div>
 *       <h2>{data?.count} applications trouvées</h2>
 *       <ul>
 *         {data?.applications.map(app => <li key={app.id}>{app.name}</li>)}
 *       </ul>
 *     </div>
 *   )
 * }
 * ```
 */
export function useVtomApplications(environmentId: string = 'PAY_TOURS') {
  const [data, setData] = useState<VtomApplicationsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    /**
     * Fonction asynchrone pour récupérer les applications depuis l'API VTOM
     */
    const fetchVtomApplications = async () => {
      try {
        // Appel GET à l'API VTOM pour récupérer les applications d'un environnement
        const response = await fetch(`${VTOM_API_URL}/environments/${environmentId}/applications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': VTOM_API_KEY,
          },
        })

        // Vérification du statut HTTP de la réponse
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const jsonData = await response.json()
        console.log('VTOM Applications Data:', jsonData)

        // L'API VTOM retourne un tableau d'applications avec des détails complets
        // (environment, name, comment, family, frequency, priority, planning, etc.)
        if (Array.isArray(jsonData)) {
          setData({
            applications: jsonData,
            count: jsonData.length,
            environment: environmentId,
          })
        }
        setError(null)
      } catch (err) {
        // Gestion des erreurs avec logging pour le débogage
        console.error('Erreur VTOM Applications:', err)
        setError(err instanceof Error ? err.message : "Impossible de récupérer les applications VTOM")
      } finally {
        // Arrêt du loading dans tous les cas (succès ou erreur)
        setIsLoading(false)
      }
    }

    fetchVtomApplications()
  }, [environmentId]) // Re-exécution si l'environnement change

  return { data, isLoading, error }
}
