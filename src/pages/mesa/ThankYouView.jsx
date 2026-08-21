const REVIEW_URL = import.meta.env.VITE_GOOGLE_REVIEW_URL

export default function ThankYouView({ tableNumero, onNewOrder }) {
  return (
    <div className="tracking-view">
      <h1>¡Gracias por tu visita!</h1>
      <p className="tracking-view__subtitle">Mesa {tableNumero} · Don Lucho</p>

      <p className="thank-you__message">
        Esperamos que hayas disfrutado tu pedido. Vuelve pronto 💛
      </p>

      {REVIEW_URL && (
        <a
          className="btn btn--primary btn--block"
          href={REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          ⭐ Déjanos una reseña
        </a>
      )}

      <button type="button" className="btn btn--block" onClick={onNewOrder}>
        Hacer otro pedido
      </button>
    </div>
  )
}
