import { useOrderItems } from '../../hooks/useOrderItems'
import { supabase } from '../../lib/supabaseClient'
import { formatCurrency } from '../../utils/format'
import { STATUS_LABEL, nextStatus } from '../../utils/orderStatus'
import StatusBadge from './StatusBadge'

export default function OrderDetailPanel({ order, tableNumero, onClose }) {
  const { items, loading } = useOrderItems(order?.id)

  if (!order) return null

  async function updateStatus(estado) {
    await supabase.from('orders').update({ estado }).eq('id', order.id)
  }

  const upcoming = nextStatus(order.estado)

  return (
    <div className="order-detail">
      <div className="order-detail__backdrop" onClick={onClose} />
      <div className="order-detail__panel">
        <header className="order-detail__header">
          <div>
            <h2>Mesa {tableNumero}</h2>
            <StatusBadge estado={order.estado} />
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>

        {loading ? (
          <p>Cargando ítems…</p>
        ) : (
          <ul className="order-detail__items">
            {items.map((it) => (
              <li key={it.id}>
                <span className="order-detail__qty">{it.cantidad}×</span>
                <span className="order-detail__name">{it.menu_items?.nombre}</span>
                {it.nota && <span className="order-detail__note">"{it.nota}"</span>}
              </li>
            ))}
          </ul>
        )}

        {order.notas && (
          <p className="order-detail__general-note">Nota del pedido: {order.notas}</p>
        )}

        <div className="order-detail__total">
          <span>Total</span>
          <strong>{formatCurrency(order.total)}</strong>
        </div>

        <div className="order-detail__actions">
          {upcoming && (
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => updateStatus(upcoming)}
            >
              Marcar como {STATUS_LABEL[upcoming]}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
