import { useEffect, useState } from 'react'

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
        const response = await fetch('https://10.37.44.206:40010/vtom/public/domain/5.0/environments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'Esp4Qo4tMy8rVe3q',
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
        } else if (jsonData.environments) {
          setData({
            environments: jsonData.environments,
            count: jsonData.environments.length,
          })
        } else {
          setData({
            environments: [jsonData],
            count: 1,
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
