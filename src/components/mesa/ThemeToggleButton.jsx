export default function ThemeToggleButton({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={onToggle}
      aria-label="Cambiar modo oscuro/claro"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
