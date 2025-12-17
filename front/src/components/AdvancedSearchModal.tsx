import {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { PlanApplicationsEntry } from '../types'

interface AdvancedSearchModalProps {
  applications: readonly PlanApplicationsEntry[]
  isOpen: boolean
  onClose: () => void
  onSelect: (label: string) => void
}

// Modale de recherche plein écran : filtre la liste aplatie des applications.
function AdvancedSearchModal({ applications, isOpen, onClose, onSelect }: AdvancedSearchModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      // On retarde légèrement le focus pour laisser le DOM s'afficher proprement.
      const timeoutId = window.setTimeout(() => {
        inputRef.current?.focus()
      }, 80)
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query])

  const results = useMemo<PlanApplicationsEntry[]>(() => {
    if (!normalizedQuery) return [...applications]
    return applications.filter((app) => app.label.toLowerCase().includes(normalizedQuery))
  }, [applications, normalizedQuery])

  const handleSelect = useCallback(
    (label: string) => {
      if (!label) return
      onSelect(label)
      setQuery('')
    },
    [onSelect],
  )

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && results.length > 0) {
        event.preventDefault()
        handleSelect(results[0].label)
      }
    },
    [results, handleSelect],
  )

  if (!isOpen) return null

  return (
    <div className="search-modal__overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="search-modal" onClick={(event) => event.stopPropagation()}>
        <div className="search-modal__header">
          <div>
            <p className="search-modal__eyebrow">Recherche avancée</p>
            <h3>Plan VTOM</h3>
          </div>
          <button type="button" className="plan-modal__close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        <div className="search-modal__input">
          <span role="img" aria-hidden="true">
            🔎
          </span>
          <input
            ref={inputRef}
            type="search"
            placeholder="Nom de l'application..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="search-modal__results">
          {results.length > 0 ? (
            results.map((app) => (
              <button
                key={app.label}
                type="button"
                className="search-result"
                onClick={() => handleSelect(app.label)}
              >
                <span className="search-result__title">{app.label}</span>
                <span className="search-result__meta">{app.column}</span>
              </button>
            ))
          ) : (
            <p className="search-modal__empty">Aucun résultat</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvancedSearchModal
