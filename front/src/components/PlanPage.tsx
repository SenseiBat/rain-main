/**
 * PlanPage - Page principale du plan VTOM
 * 
 * Affiche le plan applicatif complet avec deux vues :
 * 1. PlanBoard : Plan vertical avec colonnes (Sources, Intermédiaire, Fin de chaîne)
 * 2. Landscape : Plan horizontal (paysage applicatif)
 * 
 * Fonctionnalités :
 * - Clic sur une application → ouvre PlanModal avec liste des traitements
 * - Clic sur un traitement → ouvre TreatmentModal avec détails (script, jobs)
 * - Gestion de la sélection initiale depuis la recherche avancée
 * - Support de la touche Échap pour fermeture des modales
 * - Navigation vers la documentation
 * 
 * Architecture :
 * - État local : selectedApp (modale app) + selectedTreatment (modale traitement)
 * - Données depuis plan-data.json (100% statique côté front)
 * - Composition : PlanBoard + PlanModal + TreatmentModal
 */
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
  /** Colonnes du plan vertical */
  planColumns: readonly PlanColumn[]
  /** Configuration du paysage horizontal */
  landscape: LandscapePlan
  /** Fonction pour récupérer les détails d'une application par son nom */
  getAppDetail: (label: string) => AppDetail
  /** Nom de l'application à sélectionner automatiquement (depuis recherche) */
  initialSelection: string | null
  /** Callback appelé après traitement de la sélection initiale */
  onSelectionHandled?: () => void
  /** Callback pour ouvrir la recherche avancée */
  onSearchRequest?: () => void
}

/**
 * PlanPage - Composant de la page du plan VTOM
 * 
 * @example
 * ```tsx
 * <PlanPage 
 *   planColumns={planData.planColumns}
 *   landscape={planData.landscape}
 *   getAppDetail={getAppDetail}
 *   initialSelection="ADM"
 * />
 * ```
 */
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
