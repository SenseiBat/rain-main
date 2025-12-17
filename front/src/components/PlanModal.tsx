import { useCallback, useEffect, useRef, useState } from 'react'
import { AppDetail, AppTreatment } from '../types'

interface PlanModalProps {
  app: AppDetail | null
  onClose: () => void
  onSelectTreatment?: (app: AppDetail, treatment: AppTreatment) => void
}

// Modale listant les traitements d'une application avec animation d'ouverture/fermeture.
function PlanModal({ app, onClose, onSelectTreatment }: PlanModalProps) {
  // Animation d'apparition/disparition synchronisée avec la classe CSS.
  const [isClosing, setIsClosing] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setIsClosing(false)
    return () => {
      if (closeTimeoutRef.current !== null) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [app])

  // Écoute de la touche Échap uniquement lorsque la modale est ouverte.
  useEffect(() => {
    if (!app) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [app])

  const handleClose = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current)
    }
    // On déclenche une animation CSS courte pour adoucir la fermeture de modale.
    setIsClosing(true)
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 220)
  }, [onClose])

  if (!app) return null

  return (
    <div
      className={`plan-modal__overlay${isClosing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div className={`plan-modal${isClosing ? ' is-closing' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className="plan-modal__header">
          <div>
            <p className="plan-modal__eyebrow">Traitements de l'application</p>
            <h3>{app.name}</h3>
          </div>
          <button type="button" className="plan-modal__close" onClick={handleClose} aria-label="Fermer">
            ×
          </button>
        </div>
        {app.summary && <p className="plan-modal__summary">{app.summary}</p>}
        <div className="plan-modal__flow">
          {app.treatments.length > 0 ? (
            app.treatments.map((treatment, index) => {
              // Définition du contenu réutilisé quel que soit le mode (button/div).
              const pillContent = (
                <div className="plan-modal__pill">
                  <span className="plan-modal__pill-title">{treatment.name}</span>
                  <span className="plan-modal__pill-script">{treatment.script}</span>
                </div>
              )
              const isInteractive = Boolean(onSelectTreatment)

              return (
                <div key={treatment.name} className="plan-modal__step">
                  {isInteractive ? (
                    <button
                      type="button"
                      className="plan-modal__pill-button"
                      onClick={() => onSelectTreatment?.(app, treatment)}
                    >
                      {pillContent}
                    </button>
                  ) : (
                    pillContent
                  )}
                  {index < app.treatments.length - 1 && (
                    <div className="plan-modal__flow-arrow" aria-hidden="true" />
                  )}
                </div>
              )
            })
          ) : (
            <p className="plan-modal__empty">Aucun traitement documenté pour cette application.</p>
          )}
        </div>
        <button type="button" className="ghost-btn ghost-btn--outline plan-modal__back" onClick={handleClose}>
          ← Retour au plan VTOM
        </button>
      </div>
    </div>
  )
}

export default PlanModal
