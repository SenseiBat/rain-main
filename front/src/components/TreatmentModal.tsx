/**
 * TreatmentModal - Modale de détails d'un traitement
 * 
 * Modale secondaire affichant les détails complets d'un traitement :
 * - Nom du traitement
 * - Script exécuté
 * - Liste des jobs (étapes) si disponibles
 * 
 * Navigation :
 * - Bouton "Retour au plan" → ferme toutes les modales
 * - Bouton "Retour à l'application" → retour à PlanModal
 * 
 * Fonctionnalités :
 * - Animation d'ouverture/fermeture (220ms comme PlanModal)
 * - Affichage des jobs numérotés si disponibles
 * - Breadcrumb : Application > Traitement
 * - Navigation fluide entre les niveaux de détails
 * 
 * Architecture :
 * - Même système d'animation que PlanModal (isClosing + timeout)
 * - Reçoit une TreatmentSelection (app + treatment)
 * - Deux callbacks de navigation (plan ou app)
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { AppDetail, TreatmentSelection } from '../types'

interface TreatmentModalProps {
  /** Sélection active (app + traitement) ou null si fermé */
  selection: TreatmentSelection | null
  /** Callback pour retourner au plan (ferme toutes les modales) */
  onBackToPlan: () => void
  /** Callback pour retourner à la modale de l'application */
  onBackToApp: (app: AppDetail) => void
}

/**
 * TreatmentModal - Composant de la modale de traitement
 * 
 * @example
 * ```tsx
 * <TreatmentModal 
 *   selection={{ app: appDetails, treatment: selectedTreatment }}
 *   onBackToPlan={() => setSelectedTreatment(null)}
 *   onBackToApp={(app) => { setSelectedApp(app); setSelectedTreatment(null) }}
 * />
 * ```
 */
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
