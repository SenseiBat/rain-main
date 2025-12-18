/**
 * ThemeProvider - Context provider pour la gestion du thème clair/sombre
 * 
 * Fonctionnalités :
 * - Gère l'état du thème (dark/light) avec persistance
 * - Synchronise le thème avec le DOM (data-theme attribute)
 * - Sauvegarde la préférence dans cookie + localStorage (résilience)
 * - Applique une transition fluide lors du changement (800ms)
 * 
 * Priorité de chargement :
 * 1. Cookie (sécurisé, partageable entre sous-domaines)
 * 2. localStorage (fallback navigateur)
 * 3. Mode clair par défaut
 * 
 * Architecture :
 * - État géré avec useState
 * - Timer pour gérer la classe CSS de transition
 * - Mémoïsation pour éviter les re-renders
 */
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getUserPreference, setUserPreference } from '../utils/cookies'

type Theme = 'dark' | 'light'

/**
 * Type du contexte exposé aux composants
 * 
 * @property {Theme} theme - Thème actuel ('dark' ou 'light')
 * @property {function} toggleTheme - Fonction pour basculer entre les thèmes
 */
interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/** Durée de la transition CSS entre les thèmes (en millisecondes) */
const THEME_TRANSITION_MS = 800

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * ThemeProvider - Composant provider qui gère le thème de l'application
 * 
 * Synchronise automatiquement le thème avec le DOM et le persiste dans le navigateur.
 * Applique une transition fluide lors du changement de thème.
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // État du thème actuel (initialisé à 'light', sera mis à jour par useEffect)
  const [theme, setTheme] = useState<Theme>('light')
  
  // Référence au timer pour nettoyer la classe CSS de transition
  const transitionTimer = useRef<number | null>(null)

  /**
   * Déclenche l'animation de transition entre thèmes
   * Ajoute temporairement la classe 'theme-transitioning' au root HTML
   * pour permettre les transitions CSS fluides
   */
  const triggerTransition = useCallback(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.add('theme-transitioning')
    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current)
    }
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove('theme-transitioning')
      transitionTimer.current = null
    }, THEME_TRANSITION_MS)
  }, [])

  /**
   * Effet de montage : charge la préférence de thème au démarrage
   * 
   * Ordre de priorité :
   * 1. Cookie (sécurisé, partageable, SSR-friendly)
   * 2. localStorage (fallback navigateur)
   * 3. Mode clair par défaut
   * 
   * Double sauvegarde pour résilience : cookie ET localStorage
   */
  useEffect(() => {
    // 1. Vérifier le cookie en premier (plus sécurisé et partageable entre sous-domaines)
    const cookieTheme = getUserPreference('theme')
    if (cookieTheme === 'dark' || cookieTheme === 'light') {
      setTheme(cookieTheme)
      // Synchroniser avec localStorage pour backup
      window.localStorage.setItem('vtom-theme', cookieTheme)
      return
    }

    // 2. Vérifier localStorage comme fallback
    const storedTheme = window.localStorage.getItem('vtom-theme')
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme)
      // Sauvegarder dans le cookie pour la prochaine fois
      setUserPreference('theme', storedTheme, 365)
      return
    }

    // 3. Mode clair par défaut
    setTheme('light')
    setUserPreference('theme', 'light', 365)
  }, [])

  /**
   * Bascule entre le thème clair et sombre
   * Déclenche l'animation de transition
   */
  const toggleTheme = useCallback(() => {
    triggerTransition()
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [triggerTransition])

  /**
   * Effet synchronisé : met à jour le DOM et persiste le thème à chaque changement
   * 
   * Actions :
   * - Applique data-theme="dark/light" sur <html> (pour les variables CSS)
   * - Sauvegarde dans localStorage (backup navigateur)
   * - Sauvegarde dans cookie (sécurisé, 1 an d'expiration)
   */
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    
    // Double sauvegarde pour la résilience
    window.localStorage.setItem('vtom-theme', theme)
    setUserPreference('theme', theme, 365) // Cookie valide 1 an
  }, [theme])

  /**
   * Cleanup : nettoie le timer de transition au démontage du composant
   */
  useEffect(() => {
    return () => {
      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current)
      }
    }
  }, [])

  /**
   * Valeur du contexte mémoïsée pour éviter les re-renders inutiles
   */
  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook personnalisé pour accéder au contexte du thème
 * 
 * @throws {Error} Si utilisé en dehors d'un ThemeProvider
 * @returns {ThemeContextValue} Objet contenant le thème actuel et la fonction toggleTheme
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme()
 *   return <button onClick={toggleTheme}>Mode {theme}</button>
 * }
 * ```
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider')
  }
  return context
}
