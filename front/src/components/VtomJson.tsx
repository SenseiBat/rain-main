import { useState } from 'react'
import { useVtomEnvironments, useVtomApplications, useVtomUsers } from '../hooks'

/**
 * Type des modales disponibles
 */
type ModalType = 'environments' | 'applications' | 'users' | null

/**
 * Composant de la page "Vtom JSON"
 *
 * Affiche une page avec des boutons permettant d'ouvrir différentes modales :
 * 1. Environnements VTOM
 * 2. Applications VTOM (PAY_TOURS)
 * 3. Utilisateurs VTOM
 *
 * Les données sont récupérées en temps réel depuis l'API VTOM et affichées
 * dans des modales interactives avec accordion pour les détails.
 */
function VtomJson() {
  // États pour gérer l'ouverture des modales
  const [openModal, setOpenModal] = useState<ModalType>(null)
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  // Récupération des données VTOM
  const { data: envData, isLoading: envLoading, error: envError } = useVtomEnvironments()
  const { data: appsData, isLoading: appsLoading, error: appsError } = useVtomApplications('PAY_TOURS')
  const { data: usersData, isLoading: usersLoading, error: usersError } = useVtomUsers()

  /**
   * Bascule l'état ouvert/fermé d'un élément dans l'accordion
   */
  const toggleItem = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index)
  }

  /**
   * Ferme la modale et réinitialise l'accordion
   */
  const closeModal = () => {
    setOpenModal(null)
    setExpandedItem(null)
  }

  /**
   * Formatte une valeur pour l'affichage dans l'accordion
   */
  const renderValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  return (
    <>
      <section className="vtom-intro">
        <div>
          <p className="vtom-intro__eyebrow">Infrastructure VTOM</p>
          <h2>Vtom JSON</h2>
          <p>
            Consultez les environnements, applications et utilisateurs VTOM disponibles.
            Sélectionnez une catégorie pour afficher les détails.
          </p>
        </div>
      </section>

      {/* Section avec les cartes pour ouvrir les modales */}
      <section className="vtom-section">
        <div className="vtom-section__header">
          <h3>📊 Données VTOM disponibles</h3>
          <p>Cliquez sur une catégorie pour afficher les informations détaillées</p>
        </div>

        <div className="vtom-grid">
          {/* Carte Environnements */}
          <button
            className="vtom-card vtom-card--clickable"
            onClick={() => setOpenModal('environments')}
            aria-label="Ouvrir la liste des environnements"
          >
            <div className="vtom-card__icon">🌐</div>
            <h4 className="vtom-card__title">Environnements</h4>
            <p className="vtom-card__meta">
              {envLoading ? 'Chargement...' : envError ? 'Erreur' : `${envData?.count || 0} disponible(s)`}
            </p>
            <span className="vtom-card__action">Voir détails →</span>
          </button>

          {/* Carte Applications */}
          <button
            className="vtom-card vtom-card--clickable"
            onClick={() => setOpenModal('applications')}
            aria-label="Ouvrir la liste des applications"
          >
            <div className="vtom-card__icon">📦</div>
            <h4 className="vtom-card__title">Applications</h4>
            <p className="vtom-card__meta">
              {appsLoading ? 'Chargement...' : appsError ? 'Erreur' : `${appsData?.count || 0} dans PAY_TOURS`}
            </p>
            <span className="vtom-card__action">Voir détails →</span>
          </button>

          {/* Carte Utilisateurs */}
          <button
            className="vtom-card vtom-card--clickable"
            onClick={() => setOpenModal('users')}
            aria-label="Ouvrir la liste des utilisateurs"
          >
            <div className="vtom-card__icon">👥</div>
            <h4 className="vtom-card__title">Utilisateurs</h4>
            <p className="vtom-card__meta">
              {usersLoading ? 'Chargement...' : usersError ? 'Erreur' : `${usersData?.count || 0} utilisateur(s)`}
            </p>
            <span className="vtom-card__action">Voir détails →</span>
          </button>
        </div>
      </section>

      {/* Modale Environnements */}
      {openModal === 'environments' && (
        <div className="documentation-modal__overlay" onClick={closeModal}>
          <div className="documentation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="documentation-modal__header">
              <div>
                <p className="documentation-modal__eyebrow">Infrastructure VTOM</p>
                <h3>🌐 Environnements VTOM</h3>
              </div>
              <button
                className="documentation-modal__close"
                onClick={closeModal}
                aria-label="Fermer la modale"
              >
                ✕
              </button>
            </div>

            <div className="documentation-modal__body">
              {envLoading && (
                <div className="vtom-loading">
                  <p>⏳ Chargement des environnements...</p>
                </div>
              )}

              {envError && (
                <div className="vtom-error">
                  <p>❌ Erreur lors du chargement des environnements</p>
                  <p className="vtom-error__message">{envError}</p>
                </div>
              )}

              {envData && !envLoading && !envError && (
                <>
                  <div className="vtom-summary">
                    <span className="vtom-summary__count">{envData.count}</span>
                    <span className="vtom-summary__label">
                      environnement{envData.count > 1 ? 's' : ''} trouvé{envData.count > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="vtom-accordion">
                    {envData.environments.map((env, index) => (
                      <div key={env.id || index} className="vtom-accordion-item">
                        <button
                          className={`vtom-accordion-header ${expandedItem === index ? 'expanded' : ''}`}
                          onClick={() => toggleItem(index)}
                          aria-expanded={expandedItem === index}
                        >
                          <div className="vtom-accordion-header__content">
                            <span className="vtom-accordion-header__icon">🌐</span>
                            <div className="vtom-accordion-header__text">
                              <h4 className="vtom-accordion-header__title">
                                {String(env.name || env.id || `Environnement ${index + 1}`)}
                              </h4>
                              {env.id && (
                                <p className="vtom-accordion-header__meta">ID: {String(env.id)}</p>
                              )}
                            </div>
                          </div>
                          <span className="vtom-accordion-header__arrow">
                            {expandedItem === index ? '▼' : '▶'}
                          </span>
                        </button>

                        {expandedItem === index && (
                          <div className="vtom-accordion-content">
                            <div className="vtom-accordion-grid">
                              {Object.entries(env).map(([key, value]) => (
                                <div key={key} className="vtom-accordion-field">
                                  <span className="vtom-accordion-field__label">{key}:</span>
                                  <span className="vtom-accordion-field__value">
                                    {renderValue(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale Applications */}
      {openModal === 'applications' && (
        <div className="documentation-modal__overlay" onClick={closeModal}>
          <div className="documentation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="documentation-modal__header">
              <div>
                <p className="documentation-modal__eyebrow">Environnement PAY_TOURS</p>
                <h3>📦 Applications VTOM</h3>
              </div>
              <button
                className="documentation-modal__close"
                onClick={closeModal}
                aria-label="Fermer la modale"
              >
                ✕
              </button>
            </div>

            <div className="documentation-modal__body">
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

                  <div className="vtom-accordion">
                    {appsData.applications.map((app, index) => (
                      <div key={app.id || index} className="vtom-accordion-item">
                        <button
                          className={`vtom-accordion-header ${expandedItem === index ? 'expanded' : ''}`}
                          onClick={() => toggleItem(index)}
                          aria-expanded={expandedItem === index}
                        >
                          <div className="vtom-accordion-header__content">
                            <span className="vtom-accordion-header__icon">📦</span>
                            <div className="vtom-accordion-header__text">
                              <h4 className="vtom-accordion-header__title">
                                {String(app.name || `Application ${index + 1}`)}
                              </h4>
                              <p className="vtom-accordion-header__meta">
                                Environnement: {String(app.environment || 'N/A')}
                              </p>
                            </div>
                          </div>
                          <span className="vtom-accordion-header__arrow">
                            {expandedItem === index ? '▼' : '▶'}
                          </span>
                        </button>

                        {expandedItem === index && (
                          <div className="vtom-accordion-content">
                            <div className="vtom-accordion-grid">
                              {Object.entries(app).map(([key, value]) => (
                                <div key={key} className="vtom-accordion-field">
                                  <span className="vtom-accordion-field__label">{key}:</span>
                                  <span className="vtom-accordion-field__value">
                                    {renderValue(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale Utilisateurs */}
      {openModal === 'users' && (
        <div className="documentation-modal__overlay" onClick={closeModal}>
          <div className="documentation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="documentation-modal__header">
              <div>
                <p className="documentation-modal__eyebrow">Infrastructure VTOM</p>
                <h3>👥 Utilisateurs VTOM</h3>
              </div>
              <button
                className="documentation-modal__close"
                onClick={closeModal}
                aria-label="Fermer la modale"
              >
                ✕
              </button>
            </div>

            <div className="documentation-modal__body">
              {usersLoading && (
                <div className="vtom-loading">
                  <p>⏳ Chargement des utilisateurs...</p>
                </div>
              )}

              {usersError && (
                <div className="vtom-error">
                  <p>❌ Erreur lors du chargement des utilisateurs</p>
                  <p className="vtom-error__message">{usersError}</p>
                </div>
              )}

              {usersData && !usersLoading && !usersError && (
                <>
                  <div className="vtom-summary">
                    <span className="vtom-summary__count">{usersData.count}</span>
                    <span className="vtom-summary__label">
                      utilisateur{usersData.count > 1 ? 's' : ''} trouvé{usersData.count > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="vtom-accordion">
                    {usersData.users.map((user, index) => (
                      <div key={user.id || index} className="vtom-accordion-item">
                        <button
                          className={`vtom-accordion-header ${expandedItem === index ? 'expanded' : ''}`}
                          onClick={() => toggleItem(index)}
                          aria-expanded={expandedItem === index}
                        >
                          <div className="vtom-accordion-header__content">
                            <span className="vtom-accordion-header__icon">👤</span>
                            <div className="vtom-accordion-header__text">
                              <h4 className="vtom-accordion-header__title">
                                {String(user.name || user.login || `Utilisateur ${index + 1}`)}
                              </h4>
                              {(user.email || user.login) && (
                                <p className="vtom-accordion-header__meta">
                                  {String(user.email || user.login || 'N/A')}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="vtom-accordion-header__arrow">
                            {expandedItem === index ? '▼' : '▶'}
                          </span>
                        </button>

                        {expandedItem === index && (
                          <div className="vtom-accordion-content">
                            <div className="vtom-accordion-grid">
                              {Object.entries(user).map(([key, value]) => (
                                <div key={key} className="vtom-accordion-field">
                                  <span className="vtom-accordion-field__label">{key}:</span>
                                  <span className="vtom-accordion-field__value">
                                    {renderValue(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VtomJson
