import { useCallback, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AdvancedSearchModal from './AdvancedSearchModal'
import CookieConsent from './CookieConsent'
import Documentation from './Documentation'
import Footer from './Footer'
import Hero from './Hero'
import Home from './Home'
import PlanPage from './PlanPage'
import { usePlanData } from '../hooks/usePlanData'

// Gère la navigation principale, la barre héro, et la recherche avant d'orienter vers les pages.
// Ce composant coordonne les données statiques et les interactions utilisateur.
function AppLayout() {
  const { planData, planApplications: precomputedApplications, getAppDetail, updatePlanData } = usePlanData()
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
              onImportData={updatePlanData}
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
