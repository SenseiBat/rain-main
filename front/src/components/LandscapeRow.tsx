/**
 * LandscapeRow - Rendu d'une ligne du plan (plan horizontal)
 * 
 * Gère 5 types de lignes différentes :
 * 1. **stack** : Pile verticale de plusieurs applications (items)
 * 2. **connection** : Deux applications reliées par une flèche (from → to)
 * 3. **single** : Application isolée occupant toute la largeur
 * 4. **columns** : Plusieurs colonnes avec titres optionnels et items
 * 5. **grid** : Répartition automatique en grille (fallback par défaut)
 * 
 * Le type est défini dans le JSON (plan-data.json) pour permettre
 * une organisation visuelle flexible sans modifier le code.
 * 
 * Architecture :
 * - Utilise PlanPill pour le rendu de chaque application
 * - Structure DOM adaptée selon le type de ligne
 * - Classes CSS BEM pour styling spécifique (.landscape-row--*)
 * - Callback onSelect pour ouvrir les modales d'applications
 */
import PlanPill from './PlanPill'
import { LandscapeRow as LandscapeRowType, PlanItem } from '../types'

interface LandscapeRowProps {
  /** Configuration de la ligne (type, items, colonnes...) depuis le JSON */
  row: LandscapeRowType
  /** Callback déclenché lors du clic sur une application */
  onSelect?: (item: PlanItem) => void
}

/**
 * LandscapeRow - Composant de rendu d'une ligne du plan horizontal
 * 
 * @example
 * ```tsx
 * <LandscapeRow 
 *   row={{ type: 'stack', items: [...] }} 
 *   onSelect={handleOpenModal} 
 * />
 * ```
 */
function LandscapeRow({ row, onSelect }: LandscapeRowProps) {
  if (row.type === 'stack') {
    // Pile verticale de plusieurs pilules.
    return (
      <div className="landscape-row landscape-row--stack">
        {row.items.map((item) => (
          <PlanPill key={item.label} item={item} onSelect={onSelect} />
        ))}
      </div>
    )
  }

  if (row.type === 'connection') {
    // Deux pilules reliées visuellement par une flèche.
    return (
      <div className="landscape-row landscape-row--connection">
        <PlanPill item={row.from} onSelect={onSelect} />
        <div className="plan-arrow" aria-hidden="true" />
        <PlanPill item={row.to} onSelect={onSelect} />
      </div>
    )
  }

  if (row.type === 'single') {
    // Élément isolé occupant toute la ligne.
    return (
      <div className="landscape-row landscape-row--single">
        <PlanPill item={{ label: row.label, color: row.color }} onSelect={onSelect} />
      </div>
    )
  }

  if (row.type === 'columns') {
    // Plusieurs colonnes internes, chacune avec son éventuel titre.
    return (
      <div className="landscape-row landscape-row--columns">
        {row.columns.map((column, index) => (
          <div key={column.title ?? index} className="landscape-column">
            {column.title && <p className="landscape-column__title">{column.title}</p>}
            {column.items.map((item) => (
              <PlanPill key={item.label} item={item} onSelect={onSelect} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    // Mode « grid » : fallback couvrant les lignes à répartition automatique.
    <div className="landscape-row landscape-row--grid">
      {row.items.map((item) => (
        <PlanPill key={item.label} item={item} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default LandscapeRow
