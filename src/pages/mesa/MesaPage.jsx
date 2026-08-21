import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTable } from '../../hooks/useTable'
import { useMenu } from '../../hooks/useMenu'
import { CartProvider, useCart } from '../../context/CartContext'
import CategoryTabs from '../../components/menu/CategoryTabs'
import MenuItemCard from '../../components/menu/MenuItemCard'
import CartDrawer from '../../components/cart/CartDrawer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import OrderTrackingView from './OrderTrackingView'
import { supabase } from '../../lib/supabaseClient'

function MesaMenu({ table }) {
  const { categories, loading, error } = useMenu()
  const { items, count, total, addItem, clear } = useCart()
  const [activeCategory, setActiveCategory] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [orderId, setOrderId] = useState(null)

  const category = activeCategory ?? categories[0]?.categoria
  const visibleItems = categories.find((c) => c.categoria === category)?.items ?? []

  async function confirmOrder() {
    setSubmitting(true)
    setSubmitError(null)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ table_id: table.id, total })
      .select()
      .single()

    if (orderError) {
      setSubmitError(orderError.message)
      setSubmitting(false)
      return
    }

    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((line) => ({
        order_id: order.id,
        menu_item_id: line.menuItemId,
        cantidad: line.cantidad,
        nota: line.nota || null,
      }))
    )

    if (itemsError) {
      setSubmitError(itemsError.message)
      setSubmitting(false)
      return
    }

    clear()
    setSubmitting(false)
    setCartOpen(false)
    setOrderId(order.id)
  }

  if (orderId) {
    return (
      <OrderTrackingView
        orderId={orderId}
        tableNumero={table.numero}
        onNewOrder={() => setOrderId(null)}
      />
    )
  }

  if (loading) return <LoadingSpinner label="Cargando el menú…" />
  if (error) return <p className="error-text">No pudimos cargar el menú: {error}</p>

  return (
    <div className="mesa-page">
      <header className="mesa-page__header">
        <h1>Don Lucho</h1>
        <p>Mesa {table.numero}</p>
      </header>

      <CategoryTabs
        categories={categories.map((c) => c.categoria)}
        active={category}
        onSelect={setActiveCategory}
      />

      <div className="mesa-page__grid">
        {visibleItems.map((item) => (
          <MenuItemCard key={item.id} item={item} onAdd={addItem} />
        ))}
      </div>

      {submitError && <p className="error-text">{submitError}</p>}

      {count > 0 && (
        <button
          type="button"
          className="floating-cart-btn"
          onClick={() => setCartOpen(true)}
        >
          Ver pedido · {count}
        </button>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onConfirm={confirmOrder}
        submitting={submitting}
      />
    </div>
  )
}

export default function MesaPage() {
  const { tableId } = useParams()
  const numero = Number(tableId)
  const { table, loading, error } = useTable(numero)

  if (loading) return <LoadingSpinner label="Cargando mesa…" />

  if (error || !table || !table.activa) {
    return (
      <div className="mesa-page__unavailable">
        <h1>Mesa no disponible</h1>
        <p>Pide ayuda a un mesero de Don Lucho para continuar.</p>
      </div>
    )
  }

  return (
    <CartProvider>
      <MesaMenu table={table} />
    </CartProvider>
  )
}
