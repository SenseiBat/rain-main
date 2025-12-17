// Configuration de l'API backend
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8009'

// Configuration des transitions de thème
export const THEME_TRANSITION_MS = 800

// Messages d'erreur
export const ERROR_MESSAGES = {
  BACKEND_UNAVAILABLE: "Le backend n'a pas répondu.",
  PLAN_DATA_NOT_FOUND: 'usePlanData must be used within PlanDataProvider',
  THEME_NOT_FOUND: 'useTheme must be used within ThemeProvider',
} as const
