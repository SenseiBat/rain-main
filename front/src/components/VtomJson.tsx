import { useVtomEnvironments } from '../hooks/useVtomEnvironments'

// Page Vtom JSON : affiche la liste des environnements VTOM
// Chaque environnement est affiché dans un bloc individuel
function VtomJson() {
  const { data, isLoading, error } = useVtomEnvironments()

  return (
    <>
      <section className="environnement-intro">
        <div>
          <p className="environnement-intro__eyebrow">Infrastructure VTOM</p>
          <h2>Vtom JSON</h2>
          <p>
            Consultez la liste complète des environnements VTOM disponibles. Ces informations sont
            récupérées en temps réel via l'API VTOM.
          </p>
        </div>
      </section>

      <section className="environnement-list">
        {isLoading && (
          <div className="environnement-loading">
            <p>⏳ Chargement des environnements VTOM...</p>
          </div>
        )}

        {error && (
          <div className="environnement-error">
            <p>❌ Erreur lors du chargement des environnements</p>
            <p className="environnement-error__message">{error}</p>
          </div>
        )}

        {data && !isLoading && !error && (
          <>
            <div className="environnement-summary">
              <h3>
                {data.count} environnement{data.count > 1 ? 's' : ''} trouvé{data.count > 1 ? 's' : ''}
              </h3>
            </div>

            <div className="environnement-grid">
              {data.environments.map((env, index) => (
                <div key={env.id || index} className="environnement-card">
                  <div className="environnement-card__header">
                    <span className="environnement-card__icon">🌐</span>
                    <h4 className="environnement-card__title">
                      {env.name || env.id || `Environnement ${index + 1}`}
                    </h4>
                  </div>
                  {env.id && (
                    <div className="environnement-card__info">
                      <span className="environnement-card__label">ID:</span>
                      <span className="environnement-card__value">{env.id}</span>
                    </div>
                  )}
                  {Object.entries(env)
                    .filter(([key]) => key !== 'id' && key !== 'name')
                    .map(([key, value]) => (
                      <div key={key} className="environnement-card__info">
                        <span className="environnement-card__label">{key}:</span>
                        <span className="environnement-card__value">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </>
        )}

        {data && data.environments.length === 0 && !isLoading && !error && (
          <div className="environnement-empty">
            <p>Aucun environnement VTOM trouvé.</p>
          </div>
        )}
      </section>
    </>
  )
}

export default VtomJson
