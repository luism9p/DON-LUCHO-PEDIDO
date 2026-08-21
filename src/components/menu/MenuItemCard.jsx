import { formatCurrency } from '../../utils/format'

export default function MenuItemCard({ item, onAdd }) {
  return (
    <article className="menu-item-card">
      <div className="menu-item-card__photo">
        {item.imagen_url ? (
          <img src={item.imagen_url} alt={item.nombre} loading="lazy" />
        ) : (
          <div className="menu-item-card__photo-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="menu-item-card__body">
        <h3>{item.nombre}</h3>
        {item.descripcion && <p>{item.descripcion}</p>}
        <div className="menu-item-card__footer">
          <span className="menu-item-card__price">{formatCurrency(item.precio)}</span>
          <button type="button" className="btn btn--add" onClick={() => onAdd(item)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
