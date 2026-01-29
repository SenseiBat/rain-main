/**
 * Footer - Pied de page de l'application
 * 
 * Affiche :
 * - Logo de la République française avec devise
 * - Informations sur le site (description, version)
 * - Navigation (liens vers les pages principales)
 * - Informations techniques (technologies utilisées)
 * - Copyright avec année dynamique
 * 
 * Design :
 * - Suit les principes du design system de l'État (DSFR)
 * - Police Marianne (officielle de la République)
 * - Layout en colonnes responsive
 * - Support thème clair/sombre
 */
import logoRepublique from '../assets/Logo_de_la_République_française_(1999).svg.png'

/**
 * Footer - Composant du pied de page
 */
function Footer(): React.JSX.Element {
  // Année dynamique pour le copyright
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="app-footer__container">
        <div className="app-footer__main">
          {/* Section logo République française + devise */}
          <div className="app-footer__logo-section">
            <img 
              src={logoRepublique} 
              alt="Logo de la République française" 
              className="app-footer__logo"
            />
            <p className="app-footer__motto">
              Liberté • Égalité • Fraternité
            </p>
          </div>

          {/* Colonnes d'informations */}
          <div className="app-footer__info">
            {/* Colonne : À propos */}
            <div className="app-footer__column">
              <h3 className="app-footer__title">À propos</h3>
              <p className="app-footer__description">
                Site documentaire - Paysage VTOM<br />
                Visualisation des applications, traitements et dépendances
              </p>
            </div>

            {/* Colonne : Navigation */}
            <div className="app-footer__column">
              <h3 className="app-footer__title">Navigation</h3>
              <ul className="app-footer__links">
                <li><a href="/">Accueil</a></li>
                <li><a href="/plan">Plan complet</a></li>
                <li><a href="/vtom-plan">Plan Cartographique</a></li>
                <li><a href="/vtom-json">Vtom JSON</a></li>
                <li><a href="/documentation">Documentation</a></li>
              </ul>
            </div>

            {/* Colonne : Informations techniques */}
            <div className="app-footer__column">
              <h3 className="app-footer__title">Informations</h3>
              <ul className="app-footer__links">
                <li>Version 1.0.0</li>
                <li>Police : Marianne</li>
                <li>React + TypeScript</li>
                <li>Laravel API</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="app-footer__bottom">
          <p className="app-footer__copyright">
            © {currentYear} République Française - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
