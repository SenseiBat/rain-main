/**
 * AppLayout - Layout principal de l'application avec routing
 * 
 * Responsabilités :
 * - Gestion du routing (React Router v6) entre toutes les pages
 * - Affichage permanent du Hero (bandeau de navigation) et Footer
 * - Coordination de la modale de recherche avancée
 * - Distribution des données du plan (planData) aux composants enfants
 * - Gestion de la sélection depuis la recherche avec navigation automatique
 * 
 * Architecture :
 * - Layout persistant : Hero + Routes + Footer + CookieConsent
 * - Données centralisées via usePlanData (depuis plan-data.json)
 * - État local : ouverture modale de recherche + sélection active
 * - Routes disponibles : /, /plan, /vtom-json, /documentation
 * 
 * Flux de recherche :
 * 1. Utilisateur ouvre la recherche (depuis QuickAccess ou Hero)
 * 2. Sélectionne une application dans AdvancedSearchModal
 * 3. Redirection automatique vers /plan avec sélection pré-appliquée
 * 4. PlanPage reçoit la sélection et ouvre la modale correspondante
 */
import { useCallback, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AdvancedSearchModal from './AdvancedSearchModal'
import CookieConsent from './CookieConsent'
import Documentation from './Documentation'
import VtomJson from './VtomJson'
import Footer from './Footer'
import Hero from './Hero'
import Home from './Home'
import PlanPage from './PlanPage'
import { usePlanData } from '../hooks/usePlanData'

/**
 * AppLayout - Composant racine de l'application avec routing
 * 
 * @example
 * ```tsx
 * // Utilisé directement dans App.tsx
 * <AppLayout />
 * ```
 */
function AppLayout() {
  const { planData, planApplications: precomputedApplications, getAppDetail } = usePlanData()
  const {
    hero: heroContent,
    quickAccess: quickAccessContent,
    planColumns,
    landscape: landscapePlan,
  } = planData
  // Hooks router pour connaître la route active et déclencher les navigations programmatiques.
  const location = useLocation()
  const navigate = useNavigate()
  // État UI : ouverture de la modale de recherche et sélection issue de la recherche.
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchSelection, setSearchSelection] = useState<string | null>(null)

  const homeSnapshot = useMemo(() => {
    return {
      eyebrow: 'VTOM en bref',
      title: 'Une orchestration robuste et guidée',
      description:
        'Visualisez les applications, leurs traitements et les parcours.',
      docTeaser: {
        eyebrow: 'Documentation',
        title: 'Guides utilisateur & développeur',
        description:
          'Consultez les différents guides pour bien comprendre le site, que vous soyez utilisateur ou développeur.',
      },
    }
  }, [])

  // Lorsque l'utilisateur choisit une application dans la modale, on ferme et on ouvre la page plan.
  const handleSearchSelect = useCallback(
    (appLabel: string) => {
      if (!appLabel) return
      setIsSearchOpen(false)
      navigate('/plan')
      setSearchSelection(appLabel)
    },
    [navigate],
  )

  const handleOpenSearch = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  const handleSelectionHandled = useCallback(() => {
    setSearchSelection(null)
  }, [])

  // Layout global : bandeau héro fixe, puis les différentes routes déclarées via React Router.
  return (
    <div className="page">
      <Hero content={heroContent} activePath={location.pathname} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              quickAccess={quickAccessContent}
              onOpenSearch={handleOpenSearch}
              snapshot={homeSnapshot}
            />
          }
        />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/vtom-json" element={<VtomJson />} />
        <Route
          path="/plan"
          element={
            <PlanPage
              planColumns={planColumns}
              landscape={landscapePlan}
              getAppDetail={getAppDetail}
              initialSelection={searchSelection}
              onSelectionHandled={handleSelectionHandled}
              onSearchRequest={handleOpenSearch}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AdvancedSearchModal
        applications={precomputedApplications}
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        onSelect={handleSearchSelect}
      />
      <CookieConsent />
      <Footer />
    </div>
  )
}

export default AppLayout
