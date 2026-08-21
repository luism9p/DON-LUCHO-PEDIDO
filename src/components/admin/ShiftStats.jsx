import { formatCurrency } from '../../utils/format'

export default function ShiftStats({ revenue, topSeller }) {
  return (
    <section className="shift-stats">
      <div className="shift-stats__tile">
        <span className="shift-stats__label">Ingresos de hoy</span>
        <strong className="shift-stats__value">{formatCurrency(revenue)}</strong>
      </div>
      <div className="shift-stats__tile">
        <span className="shift-stats__label">Más vendido</span>
        <strong className="shift-stats__value">
          {topSeller ? `${topSeller.nombre} (${topSeller.cantidad})` : '—'}
        </strong>
      </div>
    </section>
  )
}
