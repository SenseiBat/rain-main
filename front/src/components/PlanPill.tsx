/**
 * PlanPill - Pilule colorée représentant une application ou un groupe
 * 
 * Composant de base utilisé dans tout le plan VTOM pour afficher
 * les applications sous forme de "pilules" (badges arrondis colorés).
 * 
 * Modes de fonctionnement :
 * 1. **Interactif** : Si onSelect fourni ET item.muted=false → bouton cliquable
 * 2. **Statique** : Si pas de onSelect OU item.muted=true → div simple (info uniquement)
 * 
 * Personnalisation des couleurs :
 * - Couleur définie dans le JSON (item.color)
 * - Injectée via CSS custom property (--pill-color)
 * - Consommée par App.css pour background et hover effects
 * 
 * État muted :
 * - Applique la classe .plan-pill--muted
 * - Affiche en grisé (non cliquable)
 * - Utilisé pour applications désactivées/archivées
 */
import { CSSVarProperties, PlanItem } from '../types'

interface PlanPillProps {
  /** Élément du plan (label, couleur, état muted) */
  item: PlanItem
  /** Callback optionnel lors du clic (rend la pilule interactive) */
  onSelect?: (item: PlanItem) => void
}

/**
 * PlanPill - Composant de pilule d'application
 * 
 * @example
 * ```tsx
 * // Pilule interactive
 * <PlanPill item={{ label: 'ADM', color: '#4287f5' }} onSelect={handleClick} />
 * 
 * // Pilule statique grisée
 * <PlanPill item={{ label: 'Legacy', muted: true }} />
 * ```
 */
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
