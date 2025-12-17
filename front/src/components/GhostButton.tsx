interface GhostButtonProps {
  icon?: string
  ariaLabel: string
  label: string
  variant?: 'primary' | 'outline'
  isActive?: boolean
  ariaPressed?: boolean
  hideLabel?: boolean
  onClick?: () => void
}

// Bouton réutilisable reprenant le style « ghost » avec icône et état actif.
// Utilisé dans le Hero, les modales et la planche pour garder une cohérence d'action.
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
    // Le style final dépend du variant demandé + de l'état actif.
    <button
      type="button"
      className={`ghost-btn ghost-btn--${variant}${isActive ? ' ghost-btn--active' : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-pressed={ariaPressed}
      aria-label={hideLabel ? ariaLabel : undefined}
    >
      {icon && (
        <span role="img" aria-label={ariaLabel} aria-hidden={hideLabel || undefined}>
          {icon}
        </span>
      )}
      {hideLabel ? <span className="sr-only">{label}</span> : label}
    </button>
  )
}

export default GhostButton
