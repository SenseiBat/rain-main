import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSSVarProperties, QuickAccessContent, QuickLink } from '../types'

// Grille d'accès rapide : chaque carte déclenche une redirection ou une ouverture de recherche.
// La couleur d'accent est fournie via une variable CSS personnalisée afin de garder le thème contrôlable.

interface QuickAccessProps extends QuickAccessContent {
  onOpenSearch?: () => void
}

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
