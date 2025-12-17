import { useCallback, useEffect, useRef, useState } from 'react'
import { AppDetail, TreatmentSelection } from '../types'

interface TreatmentModalProps {
  selection: TreatmentSelection | null
  onBackToPlan: () => void
  onBackToApp: (app: AppDetail) => void
}

// Modale secondaire : détaille les jobs d'un traitement et propose de revenir au plan ou à l'app.
function TreatmentModal({ selection, onBackToPlan, onBackToApp }: TreatmentModalProps) {
  // Mêmes mécaniques d'animation que PlanModal.
  const [isClosing, setIsClosing] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setIsClosing(false)
    return () => {
      if (closeTimeoutRef.current !== null) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [selection])

  const handleNavigate = useCallback(
    (destination: 'plan' | 'app') => {
      if (closeTimeoutRef.current !== null) {
        clearTimeout(closeTimeoutRef.current)
      }
      // Même logique que PlanModal : animation courte, puis rappel de navigation.
      setIsClosing(true)
      closeTimeoutRef.current = window.setTimeout(() => {
        setIsClosing(false)
        if (!selection) return
        if (destination === 'plan') {
          onBackToPlan()
        } else {
          onBackToApp(selection.app)
        }
      }, 220)
    },
    [selection, onBackToApp, onBackToPlan],
  )

  // Raccourci clavier : fermeture via Escape.
  useEffect(() => {
    if (!selection) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleNavigate('plan')
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [selection, handleNavigate])

  if (!selection) return null

  const { app, treatment } = selection

  return (
    <div
      className={`treatment-modal__overlay${isClosing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={() => handleNavigate('plan')}
    >
      <div className={`treatment-modal${isClosing ? ' is-closing' : ''}`} onClick={(event) => event.stopPropagation()}>
        {/* Barre supérieure regroupant les actions de navigation */}
        <div className="treatment-modal__nav">
          <button
            type="button"
            className="ghost-btn ghost-btn--outline"
            onClick={() => handleNavigate('plan')}
          >
            ← Retour au plan VTOM
          </button>
          <button type="button" className="ghost-btn ghost-btn--primary" onClick={() => handleNavigate('app')}>
            ← Retour à l'application {app.name}
          </button>
        </div>
        <div className="treatment-modal__header">
          <p className="treatment-modal__eyebrow">Jobs du traitement</p>
          <h3>{treatment.name}</h3>
        </div>
        {/* Liste scrollable des jobs détaillés */}
        <div className="treatment-modal__jobs">
          {treatment.jobs && treatment.jobs.length > 0 ? (
            treatment.jobs.map((job) => (
              <div key={job.label} className="treatment-job">
                <div className="treatment-job__chip">{treatment.script}</div>
                <div className="treatment-job__label">{job.label}</div>
              </div>
            ))
          ) : (
            <p className="treatment-modal__empty">Aucun job renseigné pour ce traitement.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TreatmentModal
