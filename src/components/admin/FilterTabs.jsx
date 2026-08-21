const FILTERS = [
  { value: 'todas', label: 'Todas' },
  { value: 'activas', label: 'Pedidos activos' },
  { value: 'libres', label: 'Mesas libres' },
]

export default function FilterTabs({ active, onSelect }) {
  return (
    <nav className="filter-tabs">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          className={`filter-tabs__tab ${f.value === active ? 'is-active' : ''}`}
          onClick={() => onSelect(f.value)}
        >
          {f.label}
        </button>
      ))}
    </nav>
  )
}
