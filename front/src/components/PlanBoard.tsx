import GhostButton from './GhostButton'
import LandscapeRow from './LandscapeRow'
import PlanPill from './PlanPill'
import { LandscapePlan, PlanColumn, PlanItem } from '../types'

// Tableau principal du plan : colonnes fonctionnelles + paysage des traitements.
// Les colonnes simples affichent des pilules cliquables tandis que la dernière colonne rend le paysage riche.

interface PlanBoardProps {
  columns: readonly PlanColumn[]
  landscape: LandscapePlan
  onBack: () => void
  onAppSelect?: (item: PlanItem) => void
  onSearch?: () => void
  onImportXML?: () => void
}

function PlanBoard({ columns, landscape, onBack, onAppSelect, onSearch, onImportXML }: PlanBoardProps) {
  return (
    <div className="plan-board-wrapper">
      <section className="plan-board">
        {/* Bandeau supérieur : titre, descriptif et CTA */}
        <div className="plan-board__header">
          <div>
            <p className="plan-board__eyebrow">Vue opérationnelle</p>
            <h2>Plan VTOM</h2>
            <p>Consultez les chaînes de traitements et leurs domaines fonctionnels.</p>
          </div>
          <div className="plan-board__actions">
            {onImportXML && (
              <GhostButton
                label="Importer XML"
                icon="📁"
                ariaLabel="importer un fichier XML VTOM"
                variant="primary"
                onClick={onImportXML}
              />
            )}
            {onSearch && (
              <GhostButton
                label="Recherche avancée"
                icon="🔎"
                ariaLabel="recherche avancée"
                variant="primary"
                onClick={onSearch}
              />
            )}
            <GhostButton
              label="Retour à l'accueil"
              icon="↩️"
              ariaLabel="retour"
              variant="outline"
              onClick={onBack}
            />
          </div>
        </div>
        {/* Grille mêlant colonnes simples et paysage détaillé */}
        <div className="plan-board__grid">
          {columns.map((column) => (
            <div key={column.id} className={`plan-column plan-column--${column.id}`}>
              <div className="plan-column__header">{column.title}</div>
              <div className="plan-column__body">
                {column.items.length > 0 ? (
                  column.items.map((item) => (
                    <PlanPill key={item.label} item={item} onSelect={onAppSelect} />
                  ))
                ) : (
                  <p className="plan-column__placeholder">{column.placeholder}</p>
                )}
              </div>
            </div>
          ))}
          <div className="plan-column plan-column--landscape">
            <div className="plan-column__header">{landscape.title}</div>
            {/* Paysage riche : chaque section contient ses propres rangées personnalisées */}
            <div className="plan-landscape">
              {landscape.sections.map((section) => (
                <article key={section.title} className="landscape-section">
                  <div className="landscape-section__title">{section.title}</div>
                  <div className="landscape-section__rows">
                    {section.rows.map((row, index) => (
                      <LandscapeRow key={`${section.title}-${index}`} row={row} onSelect={onAppSelect} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PlanBoard
