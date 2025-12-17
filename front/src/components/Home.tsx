import { useNavigate } from 'react-router-dom'
import GhostButton from './GhostButton'
import QuickAccess from './QuickAccess'
import { QuickAccessContent } from '../types'
import { useBackendMessage } from '../hooks/useBackendMessage'
import { useVtomEnvironments } from '../hooks/useVtomEnvironments'

// Page d'accueil : affiche les sections éditoriales puis les cartes d'accès rapide
// et demande l'ouverture de la modale de recherche lorsqu'on clique sur "Recherche avancée".

interface HomeProps {
  quickAccess: QuickAccessContent
  onOpenSearch?: () => void
  snapshot: {
    eyebrow: string
    title: string
    description: string
    docTeaser: { eyebrow: string; title: string; description: string }
  }
}

// Page d'accueil condensée : teaser + CTA documentation + accès rapide.
function Home({ quickAccess, onOpenSearch, snapshot }: HomeProps) {
  const navigate = useNavigate()
  const { message, isLoading, error } = useBackendMessage()
  const { data: vtomData, isLoading: vtomLoading, error: vtomError } = useVtomEnvironments()

  return (
    <>
      {/* Message de test de communication backend (seulement si succès) */}
      {message && !isLoading && !error && (
        <section className="backend-test">
          <div className="backend-test__content">
            <p className="backend-test__success">
              ✅ Backend connecté: {message}
            </p>
          </div>
        </section>
      )}

      {/* Affichage des données VTOM */}
      <section className="backend-test">
        <div className="backend-test__content">
          {vtomLoading && (
            <p className="backend-test__loading">
              ⏳ Chargement des environnements VTOM...
            </p>
          )}
          {vtomError && (
            <p className="backend-test__error">
              ❌ Erreur VTOM: {vtomError}
            </p>
          )}
          {vtomData && !vtomLoading && !vtomError && (
            <div className="backend-test__info">
              <p className="backend-test__info-title">
                🌐 <strong>Environnements VTOM:</strong> {vtomData.count} trouvé(s)
              </p>
              {vtomData.environments.length > 0 && (
                <ul className="backend-test__list">
                  {vtomData.environments.slice(0, 5).map((env, index) => (
                    <li key={index}>
                      {env.name || env.id || `Environnement ${index + 1}`}
                    </li>
                  ))}
                  {vtomData.environments.length > 5 && (
                    <li>... et {vtomData.environments.length - 5} de plus</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
      
      <section className="home-teaser">
        <div className="home-teaser__intro">
          <p className="home-teaser__eyebrow">{snapshot.eyebrow}</p>
          <h2>{snapshot.title}</h2>
          <p>{snapshot.description}</p>
          <GhostButton
            label="Voir le plan"
            ariaLabel="Voir le plan VTOM"
            icon="🗺️"
            variant="outline"
            onClick={() => navigate('/plan')}
          />
        </div>
      </section>
      <section className="home-doc-card">
        <div>
          <p className="home-doc-card__eyebrow">{snapshot.docTeaser.eyebrow}</p>
          <h3>{snapshot.docTeaser.title}</h3>
          <p>{snapshot.docTeaser.description}</p>
        </div>
        <GhostButton
          label="Explorer la documentation"
          ariaLabel="Explorer la documentation"
          icon="📘"
          variant="primary"
          onClick={() => navigate('/documentation')}
        />
      </section>
      {/* Grille d'accès rapide + déclenchement éventuel de la recherche */}
      <QuickAccess {...quickAccess} onOpenSearch={onOpenSearch} />
    </>
  )
}

export default Home
