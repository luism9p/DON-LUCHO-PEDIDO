const METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'yape', label: 'Yape' },
  { value: 'plin', label: 'Plin' },
  { value: 'tarjeta', label: 'Tarjeta' },
]

export default function PaymentMethodSelector({ value, onChange }) {
  return (
    <div className="payment-method">
      <span className="payment-method__label">¿Cómo vas a pagar?</span>
      <div className="payment-method__options">
        {METHODS.map((m) => (
          <button
            key={m.value}
            type="button"
            className={`payment-method__chip ${value === m.value ? 'is-active' : ''}`}
            onClick={() => onChange(m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
