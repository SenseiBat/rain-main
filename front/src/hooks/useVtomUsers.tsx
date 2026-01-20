import { useEffect, useState } from 'react'
import { VTOM_API_URL, VTOM_API_KEY } from '../constants'

/**
 * Interface représentant un utilisateur VTOM
 * Structure flexible pour s'adapter aux différentes réponses de l'API
 */
interface VtomUser {
  /** Identifiant unique de l'utilisateur */
  id?: string
  /** Nom de l'utilisateur */
  name?: string
  /** Login de l'utilisateur */
  login?: string
  /** Email de l'utilisateur */
  email?: string
  /** Permet d'accepter d'autres propriétés non typées */
  [key: string]: unknown
}

/**
 * Structure des données retournées par le hook
 */
interface VtomUsersData {
  /** Liste des utilisateurs récupérés */
  users: VtomUser[]
  /** Nombre total d'utilisateurs */
  count: number
}

/**
 * Hook personnalisé pour récupérer la liste des utilisateurs VTOM
 *
 * Effectue un appel à l'API VTOM pour récupérer tous les utilisateurs disponibles.
 * La requête est effectuée une seule fois au montage du composant.
 *
 * @returns {Object} Un objet contenant:
 *   - data: Les données des utilisateurs (null pendant le chargement)
 *   - isLoading: true pendant le chargement, false après
 *   - error: Message d'erreur en cas d'échec, null sinon
 *
 * @example
 * ```tsx
 * function UsersList() {
 *   const { data, isLoading, error } = useVtomUsers()
 *
 *   if (isLoading) return <div>Chargement...</div>
 *   if (error) return <div>Erreur: {error}</div>
 *
 *   return (
 *     <div>
 *       <h2>{data?.count} utilisateurs trouvés</h2>
 *       <ul>
 *         {data?.users.map(user => <li key={user.id}>{user.name}</li>)}
 *       </ul>
 *     </div>
 *   )
 * }
 * ```
 */
export function useVtomUsers() {
  const [data, setData] = useState<VtomUsersData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    /**
     * Fonction asynchrone pour récupérer les utilisateurs depuis l'API VTOM
     */
    const fetchVtomUsers = async () => {
      try {
        // Appel GET à l'API VTOM pour récupérer les utilisateurs
        const response = await fetch(`${VTOM_API_URL}/users`, {
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
        console.log('VTOM Users Data:', jsonData)

        // L'API VTOM retourne un tableau d'utilisateurs
        if (Array.isArray(jsonData)) {
          setData({
            users: jsonData,
            count: jsonData.length,
          })
        }
        setError(null)
      } catch (err) {
        // Gestion des erreurs avec logging pour le débogage
        console.error('Erreur VTOM Users:', err)
        setError(err instanceof Error ? err.message : "Impossible de récupérer les utilisateurs VTOM")
      } finally {
        // Arrêt du loading dans tous les cas (succès ou erreur)
        setIsLoading(false)
      }
    }

    // Exécution de la requête au montage du composant
    fetchVtomUsers()
  }, []) // Tableau de dépendances vide = exécution unique au montage

  return { data, isLoading, error }
}
