import PlanPill from './PlanPill'
import { LandscapeRow as LandscapeRowType, PlanItem } from '../types'

interface LandscapeRowProps {
  row: LandscapeRowType
  onSelect?: (item: PlanItem) => void
}

// Rend un type de rangée du paysage (pile, connexion, colonnes...) en réutilisant PlanPill.
// Chaque branche adapte la structure DOM pour coller au type de représentation demandé dans le JSON.
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
