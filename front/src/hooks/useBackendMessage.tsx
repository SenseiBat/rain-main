import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../constants'

// Hook personnalisé pour tester la communication avec le backend Laravel
export function useBackendMessage() {
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // URL du backend (port 8009 selon docker-compose.yml)
    const backendUrl = `${API_BASE_URL}/api/message`
    
    // Controller pour annuler la requête si le composant est démonté
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // Timeout de 5 secondes

    fetch(backendUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    })
      .then((response) => {
        clearTimeout(timeoutId)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json()
      })
      .then((data) => {
        setMessage(data.message || 'Message reçu !')
        setError(null)
      })
      .catch((err) => {
        clearTimeout(timeoutId)
        // Ne pas traiter l'absence de backend comme une erreur critique
        // Juste logger en mode développement
        if (import.meta.env.DEV) {
          console.info('Backend non disponible:', err.message)
        }
        if (err.name === 'AbortError') {
          setError('⏱️ Timeout: Le backend ne répond pas (5s)')
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError('🔌 Backend non accessible. Vérifiez que le serveur Laravel est démarré.')
        } else {
          setError(`❌ Erreur: ${err.message}`)
        }
        setMessage('')
      })
      .finally(() => {
        setIsLoading(false)
      })

    // Cleanup : annuler la requête si le composant est démonté
    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  return { message, isLoading, error }
}
