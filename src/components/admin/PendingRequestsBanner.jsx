const REQUEST_LABEL = {
  mesero: '🧑‍🍳 Llamó al mesero',
  cuenta: '🧾 Pidió la cuenta',
}

export default function PendingRequestsBanner({ requests, tables, onResolve }) {
  if (requests.length === 0) return null

  return (
    <ul className="pending-requests">
      {requests.map((req) => {
        const table = tables.find((t) => t.id === req.table_id)
        return (
          <li key={req.id} className="pending-requests__item">
            <span>
              Mesa {table?.numero} · {REQUEST_LABEL[req.tipo]}
            </span>
            <button
              type="button"
              className="btn btn--small"
              onClick={() => onResolve(req.id)}
            >
              Atender
            </button>
          </li>
        )
      })}
    </ul>
  )
}
