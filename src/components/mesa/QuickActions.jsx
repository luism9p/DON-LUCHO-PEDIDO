import { useEffect, useState } from 'react'
import { useTableRequest } from '../../hooks/useTableRequest'

const LABELS = {
  mesero: { button: '🧑‍🍳 Llamar mesero', toast: 'Ya avisamos al mesero 👍' },
  cuenta: { button: '🧾 Pedir la cuenta', toast: 'Ya pedimos tu cuenta 👍' },
}

export default function QuickActions({ tableId }) {
  const { createRequest, sending } = useTableRequest(tableId)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  async function handleClick(tipo) {
    const { error } = await createRequest(tipo)
    if (!error) setToast(LABELS[tipo].toast)
  }

  return (
    <div className="quick-actions">
      <button
        type="button"
        className="quick-actions__btn"
        disabled={sending === 'mesero'}
        onClick={() => handleClick('mesero')}
      >
        {LABELS.mesero.button}
      </button>
      <button
        type="button"
        className="quick-actions__btn"
        disabled={sending === 'cuenta'}
        onClick={() => handleClick('cuenta')}
      >
        {LABELS.cuenta.button}
      </button>

      {toast && <div className="quick-actions__toast">{toast}</div>}
    </div>
  )
}
