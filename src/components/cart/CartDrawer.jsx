import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/format'
import CartItemRow from './CartItemRow'
import PaymentMethodSelector from './PaymentMethodSelector'

export default function CartDrawer({
  open,
  onClose,
  onConfirm,
  submitting,
  paymentMethod,
  onPaymentMethodChange,
}) {
  const { items, total, setQuantity, setNote, removeItem } = useCart()

  return (
    <div className={`cart-drawer ${open ? 'is-open' : ''}`}>
      <div className="cart-drawer__backdrop" onClick={onClose} />
      <div className="cart-drawer__panel">
        <header className="cart-drawer__header">
          <h2>Tu pedido</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <p className="cart-drawer__empty">Todavía no agregaste nada del menú.</p>
        ) : (
          <div className="cart-drawer__items">
            {items.map((line) => (
              <CartItemRow
                key={line.lineId}
                line={line}
                onQuantityChange={(q) => setQuantity(line.lineId, q)}
                onNoteChange={(n) => setNote(line.lineId, n)}
                onRemove={() => removeItem(line.lineId)}
              />
            ))}
          </div>
        )}

        {items.length > 0 && (
          <PaymentMethodSelector value={paymentMethod} onChange={onPaymentMethodChange} />
        )}

        <footer className="cart-drawer__footer">
          <div className="cart-drawer__total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--block"
            disabled={items.length === 0 || !paymentMethod || submitting}
            onClick={onConfirm}
          >
            {submitting ? 'Enviando…' : 'Confirmar pedido'}
          </button>
        </footer>
      </div>
    </div>
  )
}
