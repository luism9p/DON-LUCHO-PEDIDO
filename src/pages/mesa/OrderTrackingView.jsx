import { useEffect } from 'react'
import { useOrderTracking } from '../../hooks/useOrderTracking'
import { STATUS_FLOW, STATUS_LABEL } from '../../utils/orderStatus'
import { formatCurrency } from '../../utils/format'

export default function OrderTrackingView({ orderId, tableNumero, onNewOrder }) {
  const { order, notFound } = useOrderTracking(orderId)

  useEffect(() => {
    if (notFound) onNewOrder()
  }, [notFound, onNewOrder])

  if (!order) {
    return (
      <div className="tracking-view">
        <p>Cargando tu pedido…</p>
      </div>
    )
  }

  const currentIndex = STATUS_FLOW.indexOf(order.estado)

  return (
    <div className="tracking-view">
      <h1>¡Pedido enviado!</h1>
      <p className="tracking-view__subtitle">Mesa {tableNumero}</p>

      <ol className="tracking-view__steps">
        {STATUS_FLOW.map((step, i) => (
          <li
            key={step}
            className={
              i < currentIndex
                ? 'is-done'
                : i === currentIndex
                  ? 'is-active'
                  : ''
            }
          >
            {STATUS_LABEL[step]}
          </li>
        ))}
      </ol>

      <div className="tracking-view__total">
        <span>Total</span>
        <strong>{formatCurrency(order.total)}</strong>
      </div>

      {order.estado === 'entregado' && (
        <button type="button" className="btn btn--primary" onClick={onNewOrder}>
          Hacer otro pedido
        </button>
      )}
    </div>
  )
}
