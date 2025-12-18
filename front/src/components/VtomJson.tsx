import { useVtomEnvironments } from '../hooks/useVtomEnvironments'
import { useVtomApplications } from '../hooks/useVtomApplications'

// Page Vtom JSON : affiche la liste des environnements VTOM et les applications de PAY_TOURS
// Les données sont organisées en sections comme sur la page d'accueil
function VtomJson() {
  const { data, isLoading, error } = useVtomEnvironments()
  const { data: appsData, isLoading: appsLoading, error: appsError } = useVtomApplications('PAY_TOURS')

  return (
    <>
      <section className="vtom-intro">
        <div>
          <p className="vtom-intro__eyebrow">Infrastructure VTOM</p>
          <h2>Vtom JSON</h2>
          <p>
            Consultez les environnements et applications VTOM disponibles. Ces informations sont
            récupérées en temps réel via l'API VTOM.
          </p>
        </div>
      </section>

      {/* Section Environnements */}
      <section className="vtom-section">
        <div className="vtom-section__header">
          <h3>🌐 Environnements VTOM</h3>
          <p>Liste des environnements disponibles dans l'infrastructure VTOM</p>
        </div>

        {isLoading && (
          <div className="vtom-loading">
            <p>⏳ Chargement des environnements...</p>
          </div>
        )}

        {error && (
          <div className="vtom-error">
            <p>❌ Erreur lors du chargement des environnements</p>
            <p className="vtom-error__message">{error}</p>
          </div>
        )}

        {data && !isLoading && !error && (
          <>
            <div className="vtom-summary">
              <span className="vtom-summary__count">{data.count}</span>
              <span className="vtom-summary__label">
                environnement{data.count > 1 ? 's' : ''} trouvé{data.count > 1 ? 's' : ''}
              </span>
            </div>

            <div className="vtom-grid">
              {data.environments.map((env, index) => (
                <div key={env.id || index} className="vtom-card">
                  <div className="vtom-card__icon">🌐</div>
                  <h4 className="vtom-card__title">
                    {env.name || env.id || `Environnement ${index + 1}`}
                  </h4>
                  {env.id && (
                    <p className="vtom-card__meta">ID: {env.id}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {data && data.environments.length === 0 && !isLoading && !error && (
          <div className="vtom-empty">
            <p>Aucun environnement trouvé.</p>
          </div>
        )}
      </section>

      {/* Section Applications PAY_TOURS */}
      <section className="vtom-section">
        <div className="vtom-section__header">
          <h3>📦 Applications PAY_TOURS</h3>
          <p>Liste des applications de l'environnement PAY_TOURS</p>
        </div>

        {appsLoading && (
          <div className="vtom-loading">
            <p>⏳ Chargement des applications...</p>
          </div>
        )}

        {appsError && (
          <div className="vtom-error">
            <p>❌ Erreur lors du chargement des applications</p>
            <p className="vtom-error__message">{appsError}</p>
          </div>
        )}

        {appsData && !appsLoading && !appsError && (
          <>
            <div className="vtom-summary">
              <span className="vtom-summary__count">{appsData.count}</span>
              <span className="vtom-summary__label">
                application{appsData.count > 1 ? 's' : ''} trouvée{appsData.count > 1 ? 's' : ''}
              </span>
            </div>

            <div className="vtom-grid">
              {appsData.applications.map((app, index) => (
                <div key={app.id || index} className="vtom-card">
                  <div className="vtom-card__icon">📦</div>
                  <h4 className="vtom-card__title">
                    {app.name || app.id || `Application ${index + 1}`}
                  </h4>
                  {app.id && (
                    <p className="vtom-card__meta">ID: {app.id}</p>
                  )}
                  {Object.entries(app)
                    .filter(([key]) => key !== 'id' && key !== 'name')
                    .slice(0, 3)
                    .map(([key, value]) => (
                      <p key={key} className="vtom-card__info">
                        <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </p>
                    ))}
                </div>
              ))}
            </div>
          </>
        )}

        {appsData && appsData.applications.length === 0 && !appsLoading && !appsError && (
          <div className="vtom-empty">
            <p>Aucune application trouvée.</p>
          </div>
        )}
      </section>
    </>
  )
}

export default VtomJson
