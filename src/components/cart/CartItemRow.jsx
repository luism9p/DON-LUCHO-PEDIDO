import { formatCurrency } from '../../utils/format'

export default function CartItemRow({ line, onQuantityChange, onNoteChange, onRemove }) {
  return (
    <div className="cart-item-row">
      <div className="cart-item-row__main">
        <span className="cart-item-row__name">{line.nombre}</span>
        <span className="cart-item-row__price">
          {formatCurrency(line.precio * line.cantidad)}
        </span>
      </div>

      <div className="cart-item-row__controls">
        <div className="qty-stepper">
          <button type="button" onClick={() => onQuantityChange(line.cantidad - 1)}>
            −
          </button>
          <span>{line.cantidad}</span>
          <button type="button" onClick={() => onQuantityChange(line.cantidad + 1)}>
            +
          </button>
        </div>
        <button type="button" className="cart-item-row__remove" onClick={onRemove}>
          Quitar
        </button>
      </div>

      <input
        type="text"
        className="cart-item-row__note"
        placeholder="Nota, ej. sin cebolla"
        value={line.nota}
        onChange={(e) => onNoteChange(e.target.value)}
      />
    </div>
  )
}
