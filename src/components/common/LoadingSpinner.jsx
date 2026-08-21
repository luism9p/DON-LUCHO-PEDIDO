export default function LoadingSpinner({ label = 'Cargando…' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__dot" />
      <span>{label}</span>
    </div>
  )
}
