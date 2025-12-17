import { CSSVarProperties, PlanItem } from '../types'

interface PlanPillProps {
  item: PlanItem
  onSelect?: (item: PlanItem) => void
}

// Pilule colorée représentant une application/traitement ; devient un bouton si onSelect est fourni.
// Les couleurs sont directement injectées via CSS custom properties pour faciliter le theming.
function PlanPill({ item, onSelect }: PlanPillProps) {
  // On mappe la couleur fournie dans le JSON sur la variable CSS consommée par App.css.
  const pillStyle: CSSVarProperties | undefined = item.color ? { '--pill-color': item.color } : undefined

  if (!onSelect || item.muted) {
    return (
      // Version purement informative : div statique (utilisée pour les éléments grisés).
      <div className={`plan-pill${item.muted ? ' plan-pill--muted' : ''}`} style={pillStyle}>
        {item.label}
      </div>
    )
  }

  return (
    // Version interactive : bouton qui remonte l'item cliqué au parent.
    <button
      type="button"
      className="plan-pill plan-pill--interactive"
      style={pillStyle}
      onClick={() => onSelect(item)}
    >
      {item.label}
    </button>
  )
}

export default PlanPill
