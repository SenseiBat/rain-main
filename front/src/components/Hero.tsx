/**
 * Hero - Bandeau de navigation principal de l'application
 * 
 * Affiche :
 * - Logo VTOM avec baseline (eyebrow, title, subtitle)
 * - Boutons de navigation vers les différentes pages
 * - Bouton de toggle du thème clair/sombre
 * 
 * Le contenu est entièrement piloté par le JSON (plan-data.json) via HeroContent
 * pour permettre une modification facile du texte sans toucher au code.
 * 
 * Architecture :
 * - Navigation via React Router avec highlight du bouton actif
 * - Composition : GhostButton pour chaque action + ThemeToggleButton
 * - Responsive : layout flex qui s'adapte aux petits écrans
 */
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GhostButton from './GhostButton'
import ThemeToggleButton from './ThemeToggleButton'
import { HeroContent } from '../types'
import logo from '../data/logo-vtom.png'

interface HeroProps {
  /** Contenu du hero (titre, baseline, actions) depuis le JSON */
  content: HeroContent
  /** Chemin actuel pour highlight le bon bouton */
  activePath: string
}

/**
 * Hero - Composant du bandeau de navigation principal
 * 
 * @example
 * ```tsx
 * <Hero content={planData.hero} activePath={location.pathname} />
 * ```
 */
function Hero({ content, activePath }: HeroProps) {
  const navigate = useNavigate()

  /**
   * Gestionnaire de navigation pour les boutons d'action
   * Utilise React Router pour navigation SPA sans rechargement
   */
  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path)
    },
    [navigate],
  )

  return (
    <header className="hero">
      <div className="hero__body">
        {/* Bloc gauche : logo VTOM + baseline (eyebrow, titre, sous-titre) */}
        <div className="hero__main">
          <div className="hero__icon hero__icon--image" aria-label={content.icon.label} role="img">
            <img src={logo} alt={content.icon.label} />
          </div>
          <div>
            <p className="hero__eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p className="hero__subtitle">{content.subtitle}</p>
          </div>
        </div>
        
        {/* Bloc droit : boutons de navigation + toggle thème */}
        <div className="hero__actions">
          {/* Génération dynamique des boutons depuis le JSON */}
          {content.actions.map((action) => (
            <GhostButton
              key={action.label}
              {...action}
              isActive={action.path === activePath} // Highlight du bouton actif
              onClick={() => handleNavigate(action.path)}
            />
          ))}
          {/* Bouton de bascule du thème clair/sombre */}
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  )
}

export default Hero
