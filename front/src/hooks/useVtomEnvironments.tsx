import { useEffect, useState } from 'react'
import { VTOM_API_URL, VTOM_API_KEY } from '../constants'

// Type pour les environnements VTOM
interface VtomEnvironment {
  id?: string
  name?: string
  [key: string]: unknown
}

interface VtomData {
  environments: VtomEnvironment[]
  count: number
}

// Hook personnalisé pour récupérer les environnements VTOM
export function useVtomEnvironments() {
  const [data, setData] = useState<VtomData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVtomEnvironments = async () => {
      try {
        const response = await fetch(`${VTOM_API_URL}/environments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': VTOM_API_KEY,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const jsonData = await response.json()
        console.log('VTOM Data:', jsonData)

        // Adapter selon la structure réelle de la réponse VTOM
        if (Array.isArray(jsonData)) {
          setData({
            environments: jsonData,
            count: jsonData.length,
          })
        }
        setError(null)
      } catch (err) {
        console.error('Erreur VTOM:', err)
        setError(err instanceof Error ? err.message : "Impossible de récupérer les environnements VTOM")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVtomEnvironments()
  }, [])

  return { data, isLoading, error }
}
