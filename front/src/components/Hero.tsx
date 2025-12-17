import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GhostButton from './GhostButton'
import ThemeToggleButton from './ThemeToggleButton'
import { HeroContent } from '../types'
import logo from '../data/logo-vtom.png'

interface HeroProps {
  content: HeroContent
  activePath: string
}

// Bandeau principal : affiche l'icône, le titre et les CTA qui pointent vers les routes.
// Il s'appuie sur HeroContent pour rester entièrement contrôlé par le JSON.
function Hero({ content, activePath }: HeroProps) {
  const navigate = useNavigate()

  const handleNavigate = useCallback(
    (path: string) => {
      // Navigation déclenchée par les CTA du bandeau.
      navigate(path)
    },
    [navigate],
  )

  return (
    <header className="hero">
      <div className="hero__body">
        {/* Bloc gauche : visuel + baseline */}
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
        {/* Bloc droit : CTA permettant de changer de page */}
        <div className="hero__actions">
          {content.actions.map((action) => (
            <GhostButton
              key={action.label}
              {...action}
              isActive={action.path === activePath}
              onClick={() => handleNavigate(action.path)}
            />
          ))}
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  )
}

export default Hero
