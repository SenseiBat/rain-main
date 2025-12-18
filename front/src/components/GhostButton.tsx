/**
 * GhostButton - Bouton réutilisable avec style "ghost" et icône
 * 
 * Composant de base pour tous les boutons de l'application.
 * Garantit une cohérence visuelle et d'accessibilité partout.
 * 
 * Fonctionnalités :
 * - Deux variants : 'primary' (rempli) et 'outline' (contour)
 * - Support des icônes (emoji ou autre)
 * - État actif pour les boutons de navigation
 * - Accessibilité : aria-label, aria-current, aria-pressed
 * - Label masquable (sr-only) pour icônes seules
 * 
 * Utilisé dans :
 * - Hero (navigation principale)
 * - Modales (actions, fermeture)
 * - Cards d'accès rapide
 * - Composants de recherche
 */
interface GhostButtonProps {
  /** Icône à afficher (emoji ou caractère) */
  icon?: string
  /** Label ARIA pour l'accessibilité */
  ariaLabel: string
  /** Texte du bouton */
  label: string
  /** Style du bouton */
  variant?: 'primary' | 'outline'
  /** État actif (pour navigation) */
  isActive?: boolean
  /** État pressé ARIA (pour toggle buttons) */
  ariaPressed?: boolean
  /** Masquer le label visuellement (mais garder pour lecteurs d'écran) */
  hideLabel?: boolean
  /** Gestionnaire de clic */
  onClick?: () => void
}

/**
 * GhostButton - Composant bouton avec style ghost
 * 
 * @example
 * ```tsx
 * <GhostButton
 *   icon="🗺️"
 *   label="Voir le plan"
 *   ariaLabel="Voir le plan VTOM"
 *   variant="outline"
 *   onClick={handleClick}
 * />
 * ```
 */
function GhostButton({
  icon,
  ariaLabel,
  label,
  variant = 'outline',
  isActive = false,
  ariaPressed,
  hideLabel = false,
  onClick,
}: GhostButtonProps) {
  return (
    <button
      type="button"
      // Classes dynamiques : variant + état actif
      className={`ghost-btn ghost-btn--${variant}${isActive ? ' ghost-btn--active' : ''}`}
      onClick={onClick}
      // Attributs ARIA pour l'accessibilité
      aria-current={isActive ? 'page' : undefined} // Indique la page courante
      aria-pressed={ariaPressed} // État pressé pour toggle buttons
      aria-label={hideLabel ? ariaLabel : undefined} // Label si texte masqué
    >
      {/* Icône (si fournie) avec role="img" pour accessibilité */}
      {icon && (
        <span role="img" aria-label={ariaLabel} aria-hidden={hideLabel || undefined}>
          {icon}
        </span>
      )}
      
      {/* Label : visible ou sr-only selon hideLabel */}
      {hideLabel ? <span className="sr-only">{label}</span> : label}
    </button>
  )
}

export default GhostButton
