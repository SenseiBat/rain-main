import GhostButton from './GhostButton'
import { useTheme } from '../contexts/ThemeProvider'

// Bouton accessible permettant de basculer entre les thèmes clair et sombre.
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <GhostButton
      icon={isDark ? '☀️' : '🌙'}
      ariaLabel={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      ariaPressed={!isDark}
      variant="outline"
      hideLabel
      onClick={toggleTheme}
    />
  )
}

export default ThemeToggleButton
