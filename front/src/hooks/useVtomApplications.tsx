import { useEffect, useState } from 'react'
import { VTOM_API_URL, VTOM_API_KEY } from '../constants'

// Type pour les applications VTOM
interface VtomApplication {
  id?: string
  name?: string
  [key: string]: unknown
}

interface VtomApplicationsData {
  applications: VtomApplication[]
  count: number
  environment: string
}

// Hook personnalisé pour récupérer les applications d'un environnement VTOM
export function useVtomApplications(environmentId: string = 'PAY_TOURS') {
  const [data, setData] = useState<VtomApplicationsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVtomApplications = async () => {
      try {
        const response = await fetch(`${VTOM_API_URL}/environments/${environmentId}/applications`, {
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
        console.log('VTOM Applications Data:', jsonData)

        // Adapter selon la structure réelle de la réponse VTOM
        if (Array.isArray(jsonData)) {
          setData({
            applications: jsonData,
            count: jsonData.length,
            environment: environmentId,
          })
        }
        setError(null)
      } catch (err) {
        console.error('Erreur VTOM Applications:', err)
        setError(err instanceof Error ? err.message : "Impossible de récupérer les applications VTOM")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVtomApplications()
  }, [environmentId])

  return { data, isLoading, error }
}
