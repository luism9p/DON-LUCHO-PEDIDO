import { useEffect, useMemo, useState } from 'react'
import { useTables } from '../../hooks/useTables'
import { useOrdersRealtime } from '../../hooks/useOrdersRealtime'
import { useAuth } from '../../context/AuthContext'
import TableCard from '../../components/admin/TableCard'
import OrderDetailPanel from '../../components/admin/OrderDetailPanel'
import StatusBadge from '../../components/admin/StatusBadge'
import { formatCurrency } from '../../utils/format'

export default function AdminDashboardPage() {
  const tables = useTables()
  const { orders, lastInsertedId } = useOrdersRealtime()
  const { signOut } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [highlightId, setHighlightId] = useState(null)

  useEffect(() => {
    if (!lastInsertedId) return
    setHighlightId(lastInsertedId)
    const t = setTimeout(() => setHighlightId(null), 6000)
    return () => clearTimeout(t)
  }, [lastInsertedId])

  const activeByTable = useMemo(() => {
    const map = new Map()
    for (const order of orders) {
      if (order.estado === 'entregado') continue
      const current = map.get(order.table_id)
      if (!current || order.created_at > current.created_at) {
        map.set(order.table_id, order)
      }
    }
    return map
  }, [orders])

  const history = useMemo(
    () =>
      orders
        .filter((o) => o.estado === 'entregado')
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [orders]
  )

  const selectedTable = selectedOrder
    ? tables.find((t) => t.id === selectedOrder.table_id)
    : null

  // Mantiene el panel de detalle sincronizado si el estado cambia en vivo.
  useEffect(() => {
    if (!selectedOrder) return
    const fresh = orders.find((o) => o.id === selectedOrder.id)
    if (fresh) setSelectedOrder(fresh)
  }, [orders, selectedOrder])

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1>Don Lucho · Panel de mesas</h1>
        <button type="button" className="btn" onClick={signOut}>
          Cerrar sesión
        </button>
      </header>

      <section className="admin-dashboard__grid">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            order={activeByTable.get(table.id)}
            highlighted={activeByTable.get(table.id)?.id === highlightId}
            onClick={setSelectedOrder}
          />
        ))}
      </section>

      <section className="admin-dashboard__history">
        <h2>Historial de hoy</h2>
        {history.length === 0 ? (
          <p>Todavía no hay pedidos entregados hoy.</p>
        ) : (
          <ul>
            {history.map((order) => {
              const table = tables.find((t) => t.id === order.table_id)
              return (
                <li key={order.id}>
                  <span>Mesa {table?.numero}</span>
                  <StatusBadge estado={order.estado} />
                  <span>{formatCurrency(order.total)}</span>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <OrderDetailPanel
        order={selectedOrder}
        tableNumero={selectedTable?.numero}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  )
}
