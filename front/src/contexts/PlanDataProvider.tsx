import { createContext, ReactNode, useMemo, useState, useCallback } from 'react'
import planDataJson from '../data/plan-data.json'
import {
  AppDetail,
  LandscapeRow,
  PlanApplicationsEntry,
  PlanDataPayload,
  PlanItem,
} from '../types'

export interface PlanDataContextValue {
  planData: PlanDataPayload
  planApplications: PlanApplicationsEntry[]
  getAppDetail: (label: string) => AppDetail
  updatePlanData: (newData: Partial<PlanDataPayload>) => void
  resetPlanData: () => void
}

export const PlanDataContext = createContext<PlanDataContextValue | undefined>(undefined)

// Le JSON statique produit par l'équipe métier (données par défaut).
const defaultPlanData = planDataJson as PlanDataPayload

function flattenItems(items: PlanItem[], columnLabel: string): PlanApplicationsEntry[] {
  return items
    .filter((item) => !item.muted)
    .map((item) => ({
      ...item,
      column: columnLabel,
    }))
}

function extractRowItems(row: LandscapeRow): PlanItem[] {
  switch (row.type) {
    case 'stack':
    case 'grid':
      return row.items
    case 'connection':
      return [row.from, row.to]
    case 'single':
      return [{ label: row.label, color: row.color }]
    case 'columns':
      return row.columns.flatMap((column) => column.items)
    default:
      return []
  }
}

export function PlanDataProvider({ children }: { children: ReactNode }) {
  // État local pour les données du plan, initialisé avec les données par défaut
  const [planData, setPlanData] = useState<PlanDataPayload>(defaultPlanData)

  // Fonction pour mettre à jour les données du plan (merge avec les données existantes)
  const updatePlanData = useCallback((newData: Partial<PlanDataPayload>) => {
    setPlanData((prev) => ({
      ...prev,
      ...newData,
      // Si on a de nouvelles colonnes, on les remplace complètement
      planColumns: newData.planColumns ?? prev.planColumns,
      // Si on a de nouveaux détails, on les merge avec les existants
      planDetails: { ...prev.planDetails, ...(newData.planDetails ?? {}) },
      // Si on a un nouveau paysage, on le remplace complètement
      landscape: newData.landscape ?? prev.landscape,
    }))
  }, [])

  // Fonction pour réinitialiser aux données par défaut
  const resetPlanData = useCallback(() => {
    setPlanData(defaultPlanData)
  }, [])

  // Liste aplatie utilisée par la modale de recherche : colonnes + paysage.
  const planApplications = useMemo<PlanApplicationsEntry[]>(() => {
    const columnEntries = planData.planColumns.flatMap((column) =>
      flattenItems(column.items, column.title),
    )

    const landscapeEntries = planData.landscape.sections.flatMap((section) => {
      const sectionLabel = `${planData.landscape.title} • ${section.title}`
      return section.rows.flatMap((row) => flattenItems(extractRowItems(row), sectionLabel))
    })

    return [...columnEntries, ...landscapeEntries]
  }, [planData])

  // Accès sécurisé aux informations détaillées d'une application.
  const getAppDetail = useCallback(
    (label: string): AppDetail => {
      return (
        planData.planDetails[label] ?? {
          name: label,
          summary: 'Documentation à venir pour cette application.',
          treatments: [],
        }
      )
    },
    [planData],
  )

  const value = useMemo(
    () => ({
      planData,
      planApplications,
      getAppDetail,
      updatePlanData,
      resetPlanData,
    }),
    [planData, planApplications, getAppDetail, updatePlanData, resetPlanData],
  )

  // Injection du contexte dans le sous-arbre.
  return <PlanDataContext.Provider value={value}>{children}</PlanDataContext.Provider>
}
