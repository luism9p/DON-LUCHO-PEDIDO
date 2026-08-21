export const ORDER_STATUS = {
  nuevo: 'nuevo',
  preparando: 'preparando',
  listo: 'listo',
  entregado: 'entregado',
}

export const STATUS_FLOW = ['nuevo', 'preparando', 'listo', 'entregado']

export const STATUS_LABEL = {
  nuevo: 'Nuevo',
  preparando: 'Preparando',
  listo: 'Listo',
  entregado: 'Entregado',
}

// Colores pensados para lectura rápida entre mesas (rojo = urgente).
export const STATUS_COLOR = {
  nuevo: '#d64545',
  preparando: '#e0a622',
  listo: '#3f9142',
  entregado: '#8a8a8a',
}

export function nextStatus(estado) {
  const i = STATUS_FLOW.indexOf(estado)
  if (i === -1 || i === STATUS_FLOW.length - 1) return null
  return STATUS_FLOW[i + 1]
}
