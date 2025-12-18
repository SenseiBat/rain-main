/**
 * PlanDataProvider - Context provider pour la gestion des données du plan VTOM
 * 
 * Ce contexte centralise toutes les données de l'application :
 * - Contenu éditorial (hero, sections, quick access)
 * - Plan VTOM (colonnes, applications, détails)
 * - Paysage applicatif (structure hiérarchique)
 * 
 * Il fournit des méthodes pour :
 * - Accéder aux données du plan
 * - Mettre à jour partiellement les données
 * - Réinitialiser aux valeurs par défaut
 * - Rechercher des applications dans le plan
 * 
 * Architecture :
 * - Données initiales chargées depuis plan-data.json (données statiques métier)
 * - État géré avec useState pour permettre des modifications runtime
 * - Mémoïsation avec useMemo/useCallback pour optimiser les performances
 */
import { createContext, ReactNode, useMemo, useState, useCallback } from 'react'
import planDataJson from '../data/plan-data.json'
import {
  AppDetail,
  LandscapeRow,
  PlanApplicationsEntry,
  PlanDataPayload,
  PlanItem,
} from '../types'

/**
 * Type du contexte exposé aux composants enfants
 * 
 * @property {PlanDataPayload} planData - Toutes les données du plan (hero, sections, colonnes, détails)
 * @property {PlanApplicationsEntry[]} planApplications - Liste aplatie de toutes les applications (plan + paysage)
 * @property {function} getAppDetail - Récupère les détails d'une application par son label
 * @property {function} updatePlanData - Met à jour partiellement les données du plan
 * @property {function} resetPlanData - Réinitialise les données aux valeurs par défaut
 */
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

/**
 * Aplatit une liste d'items du plan en ajoutant l'information de colonne
 * Filtre les items "muted" (grisés) qui ne doivent pas apparaître dans les recherches
 * 
 * @param items - Liste des items à aplatir
 * @param columnLabel - Label de la colonne parente (pour traçabilité)
 * @returns Liste d'entrées applications avec référence à leur colonne
 */
function flattenItems(items: PlanItem[], columnLabel: string): PlanApplicationsEntry[] {
  return items
    .filter((item) => !item.muted)
    .map((item) => ({
      ...item,
      column: columnLabel,
    }))
}

/**
 * Extrait les items d'une ligne du paysage applicatif
 * Gère les différents types de lignes (stack, grid, connection, single, columns)
 * 
 * @param row - Ligne du paysage à traiter
 * @returns Liste des items contenus dans cette ligne
 */
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

/**
 * PlanDataProvider - Composant provider qui injecte le contexte des données du plan
 * 
 * Gère l'état des données et expose des méthodes pour les manipuler.
 * Optimisé avec useMemo/useCallback pour éviter les re-renders inutiles.
 * 
 * @example
 * ```tsx
 * <PlanDataProvider>
 *   <App />
 * </PlanDataProvider>
 * ```
 */
export function PlanDataProvider({ children }: { children: ReactNode }) {
  // État local pour les données du plan, initialisé avec les données par défaut du JSON
  const [planData, setPlanData] = useState<PlanDataPayload>(defaultPlanData)

  /**
   * Met à jour partiellement les données du plan
   * Merge intelligent : shallow merge pour la plupart des propriétés,
   * mais merge profond pour planDetails (pour ajouter de nouveaux détails sans écraser les existants)
   */
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

  /**
   * Réinitialise les données du plan aux valeurs par défaut du JSON
   * Utile pour "reset" l'application ou annuler des modifications
   */
  const resetPlanData = useCallback(() => {
    setPlanData(defaultPlanData)
  }, [])

  /**
   * Liste aplatie de toutes les applications pour la recherche
   * Combine les applications du plan (colonnes) et du paysage applicatif
   * Chaque application garde une référence à sa colonne/section d'origine
   * 
   * Utilisé principalement par AdvancedSearchModal pour rechercher dans toutes les apps
   */
  const planApplications = useMemo<PlanApplicationsEntry[]>(() => {
    // Applications des colonnes du plan VTOM
    const columnEntries = planData.planColumns.flatMap((column) =>
      flattenItems(column.items, column.title),
    )

    // Applications du paysage applicatif (hiérarchie complexe)
    const landscapeEntries = planData.landscape.sections.flatMap((section) => {
      const sectionLabel = `${planData.landscape.title} • ${section.title}`
      return section.rows.flatMap((row) => flattenItems(extractRowItems(row), sectionLabel))
    })

    return [...columnEntries, ...landscapeEntries]
  }, [planData])

  /**
   * Récupère les détails d'une application par son label
   * Retourne un objet par défaut si l'application n'a pas de détails configurés
   * 
   * @param label - Label de l'application recherchée
   * @returns Détails de l'application (nom, résumé, traitements)
   */
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

  /**
   * Valeur du contexte mémoïsée pour éviter les re-renders inutiles
   * Ne change que si une des dépendances change
   */
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

  // Injection du contexte dans le sous-arbre des composants enfants
  return <PlanDataContext.Provider value={value}>{children}</PlanDataContext.Provider>
}
