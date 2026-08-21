import { useOrderItems } from '../../hooks/useOrderItems'
import { supabase } from '../../lib/supabaseClient'
import { formatCurrency } from '../../utils/format'
import { STATUS_LABEL, nextStatus } from '../../utils/orderStatus'
import StatusBadge from './StatusBadge'

const PAYMENT_LABEL = {
  efectivo: 'Efectivo',
  yape: 'Yape',
  plin: 'Plin',
  tarjeta: 'Tarjeta',
}

export default function OrderDetailPanel({ order, tableNumero, onClose }) {
  const { items, loading, toggleListo } = useOrderItems(order?.id)

  if (!order) return null

  async function updateStatus(estado) {
    await supabase.from('orders').update({ estado }).eq('id', order.id)
  }

  const upcoming = nextStatus(order.estado)
  const canBatchPrep = order.estado === 'nuevo' || order.estado === 'preparando'
  const allItemsReady = items.length > 0 && items.every((it) => it.listo)
  const showQuickComplete = canBatchPrep && allItemsReady && order.estado !== 'listo'

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
              <li key={it.id} className={it.listo ? 'is-ready' : ''}>
                {canBatchPrep && (
                  <input
                    type="checkbox"
                    className="order-detail__item-check"
                    checked={it.listo}
                    onChange={(e) => toggleListo(it.id, e.target.checked)}
                    aria-label={`${it.menu_items?.nombre} listo`}
                  />
                )}
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
          <span>
            Total
            {order.metodo_pago && (
              <span className="order-detail__payment-tag">
                {PAYMENT_LABEL[order.metodo_pago]}
              </span>
            )}
          </span>
          <strong>{formatCurrency(order.total)}</strong>
        </div>

        <div className="order-detail__actions">
          {showQuickComplete && (
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => updateStatus('listo')}
            >
              ✓ Todos los ítems listos — marcar pedido como Listo
            </button>
          )}
          {upcoming && (
            <button
              type="button"
              className={`btn btn--block ${showQuickComplete ? '' : 'btn--primary'}`}
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
