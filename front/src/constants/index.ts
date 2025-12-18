/**
 * Configuration centrale de l'application
 * Regroupe toutes les constantes utilisées à travers l'application
 */

// ============================================================================
// CONFIGURATION DE L'API BACKEND LARAVEL
// ============================================================================

/**
 * URL de base de l'API Laravel
 * Utilise la variable d'environnement VITE_API_URL si définie,
 * sinon utilise l'adresse IP du serveur de développement
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://10.37.44.204:8009'

// ============================================================================
// CONFIGURATION DE L'API VTOM
// ============================================================================

/**
 * URL de base de l'API VTOM (Version 5.0)
 * Cette API fournit les données des environnements et applications VTOM
 */
export const VTOM_API_URL = 'https://10.37.44.206:40010/vtom/public/domain/5.0'

/**
 * Clé d'authentification pour l'API VTOM
 * IMPORTANT: En production, cette clé devrait être stockée dans une variable d'environnement
 * et non dans le code source
 */
export const VTOM_API_KEY = 'Esp4Qo4tMy8rVe3q'

// ============================================================================
// CONFIGURATION DES TRANSITIONS ET ANIMATIONS
// ============================================================================

/**
 * Durée en millisecondes des transitions de thème (clair/sombre)
 * Utilisé pour synchroniser les animations CSS avec les changements de thème
 */
export const THEME_TRANSITION_MS = 800

// ============================================================================
// MESSAGES D'ERREUR STANDARDISÉS
// ============================================================================

/**
 * Messages d'erreur utilisés à travers l'application
 * Centralisés pour faciliter la maintenance et l'internationalisation future
 */
export const ERROR_MESSAGES = {
  /** Message affiché lorsque le backend Laravel ne répond pas */
  BACKEND_UNAVAILABLE: "Le backend n'a pas répondu.",
  
  /** Erreur levée lorsque usePlanData est utilisé hors du PlanDataProvider */
  PLAN_DATA_NOT_FOUND: 'usePlanData must be used within PlanDataProvider',
  
  /** Erreur levée lorsque useTheme est utilisé hors du ThemeProvider */
  THEME_NOT_FOUND: 'useTheme must be used within ThemeProvider',
} as const
