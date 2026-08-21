import StatusBadge from './StatusBadge'
import { formatCurrency } from '../../utils/format'

export default function TableCard({ table, order, highlighted, onClick }) {
  const hasOrder = Boolean(order)

  return (
    <button
      type="button"
      className={`table-card ${hasOrder ? `is-${order.estado}` : 'is-empty'} ${
        highlighted ? 'is-highlighted' : ''
      }`}
      onClick={() => hasOrder && onClick(order)}
      disabled={!hasOrder}
    >
      <span className="table-card__numero">Mesa {table.numero}</span>
      {hasOrder ? (
        <>
          <StatusBadge estado={order.estado} />
          <span className="table-card__total">{formatCurrency(order.total)}</span>
        </>
      ) : (
        <span className="table-card__idle">Sin pedido</span>
      )}
    </button>
  )
}
