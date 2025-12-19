/**
 * Home - Page d'accueil de l'application
 * 
 * Structure de la page :
 * 1. Section de test backend (optionnelle, affichée si connexion réussie)
 * 2. Section des environnements VTOM (affiche les 5 premiers + compteur)
 * 3. Teaser du plan VTOM avec CTA "Voir le plan"
 * 4. Card documentation avec CTA "Explorer la documentation"
 * 5. Grille d'accès rapide (QuickAccess) avec liens vers plans/recherche
 * 
 * Fonctionnalités :
 * - Affichage du statut de connexion backend Laravel
 * - Affichage des environnements VTOM disponibles
 * - Navigation vers Plan et Documentation
 * - Déclenchement de la modale de recherche avancée
 * 
 * Architecture :
 * - Hooks personnalisés pour données (useBackendMessage, useVtomEnvironments)
 * - Gestion des états de chargement et erreurs
 * - Composition avec GhostButton et QuickAccess
 */
import { useNavigate } from 'react-router-dom'
import GhostButton from './GhostButton'
import QuickAccess from './QuickAccess'
import { QuickAccessContent } from '../types'
import { useBackendMessage } from '../hooks/useBackendMessage'
import { useVtomEnvironments } from '../hooks/useVtomEnvironments'

interface HomeProps {
  /** Contenu de la section d'accès rapide (liens, description) */
  quickAccess: QuickAccessContent
  /** Callback pour ouvrir la modale de recherche avancée */
  onOpenSearch?: () => void
  /** Contenu éditorial de la page (teasers, descriptions) */
  snapshot: {
    eyebrow: string
    title: string
    description: string
    docTeaser: { eyebrow: string; title: string; description: string }
  }
}

/**
 * Home - Composant de la page d'accueil
 * 
 * @example
 * ```tsx
 * <Home 
 *   quickAccess={planData.quickAccess} 
 *   onOpenSearch={handleOpenSearchModal}
 *   snapshot={{ ... }}
 * />
 * ```
 */
function Home({ quickAccess, onOpenSearch, snapshot }: HomeProps) {
  const navigate = useNavigate()
  
  // Hook pour tester la connexion au backend Laravel
  const { message, isLoading, error } = useBackendMessage()
  
  // Hook pour récupérer les environnements VTOM disponibles
  const { data: vtomData, isLoading: vtomLoading, error: vtomError } = useVtomEnvironments()

  return (
    <>
      {/* Section de test backend : affichée uniquement si la connexion est réussie */}
      {message && !isLoading && !error && (
        <section className="backend-test">
          <div className="backend-test__content">
            <p className="backend-test__success">
              ✅ Backend connecté: {message}
            </p>
          </div>
        </section>
      )}

      {/* Section VTOM : affiche les environnements disponibles avec gestion loading/error */}
      <section className="backend-test">
        <div className="backend-test__content">
          {/* État de chargement */}
          {vtomLoading && (
            <p className="backend-test__loading">
              ⏳ Chargement des environnements VTOM...
            </p>
          )}
          
          {/* État d'erreur */}
          {vtomError && (
            <p className="backend-test__error">
              ❌ Erreur VTOM: {vtomError}
            </p>
          )}
          
          {/* État de succès : affiche les environnements Vtom */}
          {vtomData && !vtomLoading && !vtomError && (
            <div className="backend-test__info">
              <p className="backend-test__info-title">
                🌐 <strong>Environnements VTOM:</strong> {vtomData.count} trouvé(s)
              </p>
              {vtomData.environments.length > 0 && (
                <ul className="backend-test__list">
                  
                  {/* Affiche les environnements */}
                  {vtomData.environments.slice(0, vtomData.environments.length).map((env, index) => (
                    <li key={index}>
                      {env.name || env.id || `Environnement ${index + 1}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Section teaser Plan VTOM : introduction + CTA vers la page Plan */}
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
      
      {/* Card documentation : teaser + CTA vers la page Documentation */}
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
      
      {/* Grille d'accès rapide : liens directs vers plans + recherche avancée */}
      <QuickAccess {...quickAccess} onOpenSearch={onOpenSearch} />
    </>
  )
}

export default Home
