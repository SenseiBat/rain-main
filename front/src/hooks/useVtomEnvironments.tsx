import { useEffect, useState } from 'react'
import { VTOM_API_URL, VTOM_API_KEY } from '../constants'

/**
 * Interface représentant un environnement VTOM
 * Structure flexible pour s'adapter aux différentes réponses de l'API
 */
interface VtomEnvironment {
  /** Identifiant unique de l'environnement */
  id?: string
  /** Nom de l'environnement */
  name?: string
  /** Permet d'accepter d'autres propriétés non typées */
  [key: string]: unknown
}

/**
 * Structure des données retournées par le hook
 */
interface VtomData {
  /** Liste des environnements récupérés */
  environments: VtomEnvironment[]
  /** Nombre total d'environnements */
  count: number
}

/**
 * Hook personnalisé pour récupérer la liste des environnements VTOM
 * 
 * Effectue un appel à l'API VTOM pour récupérer tous les environnements disponibles.
 * La requête est effectuée une seule fois au montage du composant.
 * 
 * @returns {Object} Un objet contenant:
 *   - data: Les données des environnements (null pendant le chargement)
 *   - isLoading: true pendant le chargement, false après
 *   - error: Message d'erreur en cas d'échec, null sinon
 * 
 * @example
 * ```tsx
 * function EnvironmentsList() {
 *   const { data, isLoading, error } = useVtomEnvironments()
 *   
 *   if (isLoading) return <div>Chargement...</div>
 *   if (error) return <div>Erreur: {error}</div>
 *   
 *   return (
 *     <ul>
 *       {data?.environments.map(env => <li key={env.id}>{env.name}</li>)}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useVtomEnvironments() {
  const [data, setData] = useState<VtomData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    /**
     * Fonction asynchrone pour récupérer les environnements depuis l'API VTOM
     */
    const fetchVtomEnvironments = async () => {
      try {
        // Appel GET à l'API VTOM avec authentification par clé
        const response = await fetch(`${VTOM_API_URL}/environments`, {
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
        console.log('VTOM Data:', jsonData)

        // L'API VTOM retourne directement un tableau d'environnements
        if (Array.isArray(jsonData)) {
          setData({
            environments: jsonData,
            count: jsonData.length,
          })
        }
        setError(null)
      } catch (err) {
        // Gestion des erreurs avec logging pour le débogage
        console.error('Erreur VTOM:', err)
        setError(err instanceof Error ? err.message : "Impossible de récupérer les environnements VTOM")
      } finally {
        // Arrêt du loading dans tous les cas (succès ou erreur)
        setIsLoading(false)
      }
    }

    // Exécution de la requête au montage du composant
    fetchVtomEnvironments()
  }, []) // Tableau de dépendances vide = exécution unique au montage

  return { data, isLoading, error }
}
