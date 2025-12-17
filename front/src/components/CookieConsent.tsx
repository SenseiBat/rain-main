import { useEffect, useState } from 'react'
import { getUserPreference, setUserPreference } from '../utils/cookies'
import GhostButton from './GhostButton'

/**
 * Bannière de consentement aux cookies (conformité RGPD)
 */
function CookieConsent(): React.JSX.Element | null {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = getUserPreference('cookie_consent')
    if (!consent) {
      // Afficher la bannière après un court délai pour une meilleure UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [])

  const handleAccept = () => {
    setUserPreference('cookie_consent', 'accepted', 365)
    setIsVisible(false)
  }

  const handleDecline = () => {
    setUserPreference('cookie_consent', 'declined', 365)
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <div className="cookie-consent__text">
          <h3 className="cookie-consent__title">🍪 Utilisation des cookies</h3>
          <p className="cookie-consent__description">
            Ce site utilise des cookies pour sauvegarder vos préférences (thème clair/sombre) 
            et améliorer votre expérience. Aucune donnée personnelle n'est collectée.
          </p>
        </div>
        <div className="cookie-consent__actions">
          <GhostButton
            label="Accepter"
            ariaLabel="Accepter l'utilisation des cookies"
            icon="✓"
            variant="primary"
            onClick={handleAccept}
          />
          <GhostButton
            label="Refuser"
            ariaLabel="Refuser l'utilisation des cookies"
            icon="✗"
            variant="outline"
            onClick={handleDecline}
          />
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
