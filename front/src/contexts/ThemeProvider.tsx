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

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const THEME_TRANSITION_MS = 800

interface ThemeProviderProps {
  children: ReactNode
}

// Gère l'état du thème (clair/sombre) et synchronise le choix avec le DOM + localStorage.
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const transitionTimer = useRef<number | null>(null)

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

  // Lecture initiale : cookie prioritaire, puis localStorage, puis mode clair par défaut.
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

  const toggleTheme = useCallback(() => {
    triggerTransition()
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [triggerTransition])

  // Mise à jour du DOM et persistance à chaque changement (cookie + localStorage).
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    
    // Double sauvegarde pour la résilience
    window.localStorage.setItem('vtom-theme', theme)
    setUserPreference('theme', theme, 365) // Cookie valide 1 an
  }, [theme])

  useEffect(() => {
    return () => {
      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current)
      }
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider')
  }
  return context
}
