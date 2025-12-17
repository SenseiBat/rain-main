import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanBoard from './PlanBoard'
import PlanModal from './PlanModal'
import TreatmentModal from './TreatmentModal'
import {
  AppDetail,
  AppTreatment,
  LandscapePlan,
  PlanColumn,
  PlanItem,
  TreatmentSelection,
} from '../types'

interface PlanPageProps {
  planColumns: readonly PlanColumn[]
  landscape: LandscapePlan
  getAppDetail: (label: string) => AppDetail
  initialSelection: string | null
  onSelectionHandled?: () => void
  onSearchRequest?: () => void
}

// Vue « Plan VTOM » : gère les modales liées aux applications et traitements.
// Les données proviennent de plan-data.json afin d'afficher un plan 100 % statique côté front.
function PlanPage({
  planColumns,
  landscape,
  getAppDetail,
  initialSelection,
  onSelectionHandled,
  onSearchRequest,
}: PlanPageProps) {
  const navigate = useNavigate()
  // État local : application sélectionnée et éventuel traitement détaillé.
  const [selectedApp, setSelectedApp] = useState<AppDetail | null>(null)
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentSelection | null>(null)

  // --- Gestion de la modale « application » ----------------------------------------------------
  const handleSelectApp = useCallback(
    (item: PlanItem) => {
      const details = getAppDetail(item.label)
      setSelectedApp(details)
      setSelectedTreatment(null)
    },
    [getAppDetail],
  )

  const handleCloseModal = useCallback(() => {
    setSelectedApp(null)
  }, [])

  const handleSelectTreatment = useCallback((app: AppDetail, treatment: AppTreatment) => {
    setSelectedApp(null)
    setSelectedTreatment({ app, treatment })
  }, [])

  const handleCloseTreatmentModal = useCallback(() => {
    setSelectedTreatment(null)
  }, [])

  const handleReturnToApp = useCallback((app: AppDetail) => {
    setSelectedTreatment(null)
    setSelectedApp(app)
  }, [])

  const handleBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  // --- Effet : si la page arrive avec une sélection (depuis la recherche), on ouvre la modale ----
  useEffect(() => {
    if (initialSelection) {
      // Lorsqu'une recherche sélectionne une app, on ouvre directement la modale et on nettoie l'état parent.
      const details = getAppDetail(initialSelection)
      setSelectedApp(details)
      setSelectedTreatment(null)
      onSelectionHandled?.()
    }
  }, [getAppDetail, initialSelection, onSelectionHandled])

  return (
    <>
      {/* Tableau principal : colonnes fonctionnelles + paysage */}
      <PlanBoard
        columns={planColumns}
        landscape={landscape}
        onBack={handleBack}
        onAppSelect={handleSelectApp}
        onSearch={onSearchRequest}
      />
      {/* Modale listant les traitements de l'application sélectionnée */}
      <PlanModal app={selectedApp} onClose={handleCloseModal} onSelectTreatment={handleSelectTreatment} />
      {/* Modale secondaire détaillant les jobs d'un traitement */}
      <TreatmentModal
        selection={selectedTreatment}
        onBackToPlan={handleCloseTreatmentModal}
        onBackToApp={handleReturnToApp}
      />
    </>
  )
}

export default PlanPage
