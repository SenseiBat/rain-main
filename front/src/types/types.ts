import { CSSProperties } from 'react'

// === HERO / NAVIGATION ======================================================
export interface HeroAction {
  label: string
  icon?: string
  ariaLabel: string
  variant: 'primary' | 'outline'
  path: string
}

export interface HeroContent {
  icon: { glyph: string; label: string }
  eyebrow: string
  title: string
  subtitle: string
  actions: HeroAction[]
}

// === CONTENU ÉDITORIAL ======================================================
export interface Section {
  id: string
  title: string
  description: string
  highlights: string[]
}

export interface QuickLink {
  title: string
  description: string
  action: string
  accent: string
  to?: string
  intent?: 'search'
}

export interface QuickAccessContent {
  eyebrow: string
  title: string
  links: QuickLink[]
}

// === PLAN VTOM ==============================================================
export interface PlanItem {
  label: string
  color?: string
  muted?: boolean
}

export interface PlanColumn {
  id: string
  title: string
  placeholder: string
  items: PlanItem[]
}

export interface PlanApplicationsEntry extends PlanItem {
  column: string
}

export interface TreatmentJob {
  label: string
}

export interface AppTreatment {
  name: string
  script: string
  jobs?: TreatmentJob[]
}

export interface AppDetail {
  name: string
  summary?: string
  treatments: AppTreatment[]
}

export interface TreatmentSelection {
  app: AppDetail
  treatment: AppTreatment
}

// === PAYSAGE ================================================================
export interface LandscapeColumnLayout {
  title?: string
  items: PlanItem[]
}

export type LandscapeRowStack = { type: 'stack'; items: PlanItem[] }
export type LandscapeRowConnection = { type: 'connection'; from: PlanItem; to: PlanItem }
export type LandscapeRowSingle = { type: 'single'; label: string; color?: string }
export type LandscapeRowGrid = { type: 'grid'; items: PlanItem[] }
export type LandscapeRowColumns = { type: 'columns'; columns: LandscapeColumnLayout[] }

export type LandscapeRow =
  | LandscapeRowStack
  | LandscapeRowConnection
  | LandscapeRowSingle
  | LandscapeRowGrid
  | LandscapeRowColumns

export interface LandscapeSection {
  title: string
  rows: LandscapeRow[]
}

export interface LandscapePlan {
  title: string
  sections: LandscapeSection[]
}

// === OUTILS / TYPES PARTAGÉS ================================================
export type CSSVarProperties = CSSProperties & { [key: `--${string}`]: string | number }

export type PlanDetailsMap = Record<string, AppDetail>

// Payload complet embarqué dans plan-data.json.
export interface PlanDataPayload {
  hero: HeroContent
  homeSections: Section[]
  documentationSections: Section[]
  quickAccess: QuickAccessContent
  planColumns: PlanColumn[]
  planDetails: PlanDetailsMap
  landscape: LandscapePlan
}
