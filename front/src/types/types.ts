/**
 * types.ts - Définitions TypeScript pour l'application
 * 
 * Ce fichier centralise toutes les interfaces et types TypeScript
 * utilisés dans l'application pour garantir la cohérence des données.
 * 
 * Organisation :
 * 1. HERO / NAVIGATION - Types pour le bandeau de navigation principal
 * 2. CONTENU ÉDITORIAL - Types pour les sections textuelles et liens rapides
 * 3. PLAN VTOM - Types pour le plan applicatif et les applications
 * 4. LANDSCAPE - Types pour le paysage horizontal (plan alternatif)
 * 5. DONNÉES GLOBALES - Structure complète du fichier plan-data.json
 * 
 * Toutes ces structures correspondent au format du fichier JSON
 * (plan-data.json) qui pilote le contenu de l'application.
 */
import { CSSProperties } from 'react'

// ============================================================================
// HERO / NAVIGATION - Bandeau principal avec logo et boutons d'action
// ============================================================================

/**
 * Action cliquable dans le Hero (bouton de navigation)
 */
export interface HeroAction {
  label: string
  icon?: string
  ariaLabel: string
  variant: 'primary' | 'outline'
  path: string
}

/**
 * Contenu complet du Hero (bandeau de navigation)
 */
export interface HeroContent {
  /** Icône et libellé du logo VTOM */
  icon: { glyph: string; label: string }
  /** Texte de surtitre (ex: "Site documentaire") */
  eyebrow: string
  /** Titre principal (ex: "Paysage VTOM") */
  title: string
  /** Sous-titre descriptif */
  subtitle: string
  /** Liste des boutons de navigation */
  actions: HeroAction[]
}

// ============================================================================
// CONTENU ÉDITORIAL - Sections textuelles et liens rapides
// ============================================================================

/**
 * Section de documentation avec highlights
 */
export interface Section {
  id: string
  title: string
  description: string
  highlights: string[]
}

/**
 * Lien d'accès rapide (carte cliquable)
 */
export interface QuickLink {
  /** Titre du lien */
  title: string
  /** Description du lien */
  description: string
  /** Texte du bouton d'action */
  action: string
  /** Couleur d'accentuation */
  accent: string
  /** Chemin de navigation (optionnel si intent défini) */
  to?: string
  /** Intent spécial (ex: 'search' pour ouvrir la modale de recherche) */
  intent?: 'search'
}

/**
 * Section d'accès rapide (grille de liens)
 */
export interface QuickAccessContent {
  /** Surtitre de la section */
  eyebrow: string
  /** Titre principal */
  title: string
  /** Liste des liens rapides */
  links: QuickLink[]
}

// ============================================================================
// PLAN VTOM - Plan applicatif vertical avec colonnes
// ============================================================================

/**
 * Élément du plan (application ou groupe)
 * Représente une "pilule" cliquable dans le plan
 */
export interface PlanItem {
  /** Libellé affiché dans la pilule */
  label: string
  /** Couleur de la pilule (optionnel) */
  color?: string
  /** Si true, affiche en grisé (désactivé) */
  muted?: boolean
}

/**
 * Colonne du plan vertical
 * Chaque colonne représente une catégorie d'applications
 */
export interface PlanColumn {
  /** Identifiant unique de la colonne */
  id: string
  /** Titre affiché en haut de la colonne */
  title: string
  /** Texte affiché quand la colonne est vide */
  placeholder: string
  /** Liste des applications dans cette colonne */
  items: PlanItem[]
}

/**
 * Entrée dans planApplications (mapping application → colonne)
 */
export interface PlanApplicationsEntry extends PlanItem {
  /** ID de la colonne où se trouve l'application */
  column: string
}

/**
 * Job d'un traitement (étape d'exécution)
 */
export interface TreatmentJob {
  /** Nom du job */
  label: string
}

/**
 * Traitement d'une application
 * Un traitement représente un script/processus exécuté par l'application
 */
export interface AppTreatment {
  /** Nom du traitement */
  name: string
  /** Nom du script exécuté */
  script: string
  /** Liste optionnelle des jobs composant le traitement */
  jobs?: TreatmentJob[]
}

/**
 * Détails complets d'une application
 * Affiché dans la modale lors du clic sur une application
 */
export interface AppDetail {
  /** Nom de l'application */
  name: string
  /** Description optionnelle de l'application */
  summary?: string
  /** Liste des traitements de cette application */
  treatments: AppTreatment[]
}

/**
 * Sélection d'un traitement spécifique
 * Utilisé pour ouvrir la modale de détails d'un traitement
 */
export interface TreatmentSelection {
  /** Application parente */
  app: AppDetail
  /** Traitement sélectionné */
  treatment: AppTreatment
}

// ============================================================================
// LANDSCAPE - Paysage horizontal (représentation alternative du plan)
// ============================================================================

/**
 * Colonne dans une ligne de type 'columns'
 */
export interface LandscapeColumnLayout {
  /** Titre optionnel de la sous-colonne */
  title?: string
  /** Applications dans cette sous-colonne */
  items: PlanItem[]
}

/** Type de ligne : pile verticale d'applications */
export type LandscapeRowStack = { type: 'stack'; items: PlanItem[] }

/** Type de ligne : connexion entre deux applications (avec flèche) */
export type LandscapeRowConnection = { type: 'connection'; from: PlanItem; to: PlanItem }

/** Type de ligne : application unique occupant toute la largeur */
export type LandscapeRowSingle = { type: 'single'; label: string; color?: string }

/** Type de ligne : grille automatique d'applications */
export type LandscapeRowGrid = { type: 'grid'; items: PlanItem[] }

/** Type de ligne : plusieurs colonnes avec sous-titres */
export type LandscapeRowColumns = { type: 'columns'; columns: LandscapeColumnLayout[] }

/**
 * Union de tous les types de lignes possibles dans le paysage
 * Permet une représentation flexible du plan horizontal
 */
export type LandscapeRow =
  | LandscapeRowStack
  | LandscapeRowConnection
  | LandscapeRowSingle
  | LandscapeRowGrid
  | LandscapeRowColumns

/**
 * Section du paysage horizontal
 * Chaque section contient un titre et plusieurs lignes
 */
export interface LandscapeSection {
  /** Titre de la section */
  title: string
  /** Liste des lignes composant cette section */
  rows: LandscapeRow[]
}

/**
 * Plan paysage complet (vue horizontale)
 */
export interface LandscapePlan {
  /** Titre du paysage */
  title: string
  /** Liste des sections du paysage */
  sections: LandscapeSection[]
}

// ============================================================================
// OUTILS / TYPES PARTAGÉS
// ============================================================================

/**
 * Extension de CSSProperties pour supporter les variables CSS custom (--var)
 * Permet de définir des propriétés CSS avec préfixe --
 */
export type CSSVarProperties = CSSProperties & { [key: `--${string}`]: string | number }

/**
 * Map des détails des applications
 * Clé = nom de l'application, Valeur = détails complets
 */
export type PlanDetailsMap = Record<string, AppDetail>

// ============================================================================
// DONNÉES GLOBALES - Structure complète du fichier plan-data.json
// ============================================================================

/**
 * Payload complet du fichier plan-data.json
 * Contient toutes les données statiques de l'application
 * 
 * Ce fichier JSON pilote tout le contenu de l'application :
 * - Textes du Hero et des sections
 * - Structure du plan vertical et horizontal
 * - Détails de toutes les applications
 * - Liens rapides et navigation
 */
export interface PlanDataPayload {
  /** Contenu du bandeau de navigation principal */
  hero: HeroContent
  /** Sections de la page d'accueil */
  homeSections: Section[]
  /** Sections de la page de documentation */
  documentationSections: Section[]
  /** Contenu de la section d'accès rapide */
  quickAccess: QuickAccessContent
  /** Colonnes du plan vertical */
  planColumns: PlanColumn[]
  /** Détails de toutes les applications avec leurs traitements */
  planDetails: PlanDetailsMap
  /** Configuration du paysage horizontal */
  landscape: LandscapePlan
}
