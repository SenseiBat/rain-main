/**
 * PlanBoard - Tableau principal du plan VTOM
 * 
 * Affiche la vue complète du plan VTOM organisée en :
 * - Colonnes fonctionnelles (Domaines, Flux, Programmes, Traitements)
 * - Plan applicatif (structure hiérarchique complexe)
 * 
 * Structure :
 * - Header avec titre, description et actions (recherche, retour)
 * - Grid de colonnes :
 *   * Colonnes simples : liste de pilules (PlanPill) cliquables
 *   * Colonne paysage : sections avec lignes personnalisées (LandscapeRow)
 * 
 * Interactions :
 * - Clic sur pilule → ouvre modale de détails de l'application
 * - Bouton recherche → ouvre modale de recherche avancée
 * - Bouton retour → retour à l'accueil
 * 
 * Architecture :
 * - Composition : GhostButton, PlanPill, LandscapeRow
 * - Données depuis plan-data.json via PlanDataProvider
 * - Responsive : grid adaptatif avec overflow horizontal
 */
import GhostButton from './GhostButton'
import LandscapeRow from './LandscapeRow'
import PlanPill from './PlanPill'
import { LandscapePlan, PlanColumn, PlanItem } from '../types'

interface PlanBoardProps {
  /** Colonnes du plan (domaines, flux, programmes, traitements) */
  columns: readonly PlanColumn[]
  /** Plan applicatif avec structure hiérarchique */
  landscape: LandscapePlan
  /** Callback pour retour à l'accueil */
  onBack: () => void
  /** Callback lors de la sélection d'une application (ouvre modale) */
  onAppSelect?: (item: PlanItem) => void
  /** Callback pour ouvrir la recherche avancée */
  onSearch?: () => void
}

/**
 * PlanBoard - Composant principal du plan VTOM
 * 
 * @example
 * ```tsx
 * <PlanBoard
 *   columns={planData.planColumns}
 *   landscape={planData.landscape}
 *   onBack={() => navigate('/')}
 *   onAppSelect={handleOpenModal}
 *   onSearch={handleOpenSearch}
 * />
 * ```
 */
function PlanBoard({ columns, landscape, onBack, onAppSelect, onSearch }: PlanBoardProps) {
  return (
    <div className="plan-board-wrapper">
      <section className="plan-board">
        {/* Header : titre, baseline et boutons d'action */}
        <div className="plan-board__header">
          <div>
            <p className="plan-board__eyebrow">Vue opérationnelle</p>
            <h2>Plan VTOM</h2>
            <p>Consultez les chaînes de traitements et leurs domaines fonctionnels.</p>
          </div>
          <div className="plan-board__actions">
            {/* Bouton recherche avancée (optionnel) */}
            {onSearch && (
              <GhostButton
                label="Recherche avancée"
                icon="🔎"
                ariaLabel="recherche avancée"
                variant="primary"
                onClick={onSearch}
              />
            )}
            {/* Bouton retour à l'accueil */}
            <GhostButton
              label="Retour à l'accueil"
              icon="↩️"
              ariaLabel="retour"
              variant="outline"
              onClick={onBack}
            />
          </div>
        </div>
        
        {/* Grille du plan : colonnes simples + paysage applicatif */}
        <div className="plan-board__grid">
          {/* Colonnes simples (Domaines, Flux, Programmes, Traitements) */}
          {columns.map((column) => (
            <div key={column.id} className={`plan-column plan-column--${column.id}`}>
              <div className="plan-column__header">{column.title}</div>
              <div className="plan-column__body">
                {/* Liste de pilules si la colonne a des items */}
                {column.items.length > 0 ? (
                  column.items.map((item) => (
                    <PlanPill key={item.label} item={item} onSelect={onAppSelect} />
                  ))
                ) : (
                  /* Placeholder si colonne vide */
                  <p className="plan-column__placeholder">{column.placeholder}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Colonne paysage : structure hiérarchique complexe */}
          <div className="plan-column plan-column--landscape">
            <div className="plan-column__header">{landscape.title}</div>
            <div className="plan-landscape">
              {/* Chaque section du paysage (ex: Front-End, Back-End) */}
              {landscape.sections.map((section) => (
                <article key={section.title} className="landscape-section">
                  <div className="landscape-section__title">{section.title}</div>
                  <div className="landscape-section__rows">
                    {/* Lignes personnalisées (stack, grid, connection, etc.) */}
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
