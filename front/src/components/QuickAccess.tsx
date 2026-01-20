/**
 * QuickAccess - Section d'accès rapide avec grille de cartes cliquables
 * 
 * Affiche une grille de cartes permettant un accès rapide aux fonctionnalités principales :
 * - Navigation vers les plans (Plan complet, Landscape)
 * - Ouverture de la recherche avancée
 * - Autres raccourcis configurables
 * 
 * Personnalisation des couleurs :
 * - Chaque lien a une couleur d'accent (link.accent)
 * - Injectée via CSS custom property (--accent-color)
 * - Utilisée pour la bordure, le texte et les effets hover
 * 
 * Fonctionnalités :
 * - Intent 'search' : ouvre la modale de recherche au lieu de naviguer
 * - Navigation SPA via React Router pour les autres liens
 * - Layout responsive (grille qui s'adapte aux écrans)
 * 
 * Contenu piloté par JSON (plan-data.json > quickAccess)
 */ 
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSSVarProperties, QuickAccessContent, QuickLink } from '../types'

interface QuickAccessProps extends QuickAccessContent {
  /** Callback pour ouvrir la modale de recherche avancée */
  onOpenSearch?: () => void
}

/**
 * QuickAccess - Composant de la section d'accès rapide
 * 
 * @example
 * ```tsx
 * <QuickAccess 
 *   eyebrow="Accès rapide"
 *   title="Explorez le plan"
 *   links={[...]}
 *   onOpenSearch={handleOpenSearchModal}
 * />
 * ```
 */
function QuickAccess({ eyebrow, title, links, onOpenSearch }: QuickAccessProps) {
  const navigate = useNavigate()

  const handleLinkClick = useCallback(
    (link: QuickLink) => {
      if (link.intent === 'search') {
        // Le bouton ouvre la modale de recherche au lieu de naviguer.
        onOpenSearch?.()
        return
      }
      if (link.to) {
        // Les autres liens utilisent le router client pour naviguer rapidement.
        navigate(link.to)
      }
    },
    [navigate, onOpenSearch],
  )

  return (
    <section className="quick-access">
      <div className="quick-access__header">
        <div>
          <p className="quick-access__eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>

      {/* Grille responsive contenant toutes les cartes d'accès rapide */}
      <div className="quick-access__grid">
        {links.map((link) => {
          const accentStyle: CSSVarProperties = { '--accent-color': link.accent }
          return (
            <article key={link.title} className="quick-card" style={accentStyle}>
              <div className="quick-card__body">
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </div>
              <button
                type="button"
                className="quick-card__cta"
                onClick={() => handleLinkClick(link)}
              >
                {link.action} →
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default QuickAccess
