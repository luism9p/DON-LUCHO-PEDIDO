const PREFIX = 'donlucho:orderId:mesa:'

export function getStoredOrderId(numero) {
  return localStorage.getItem(PREFIX + numero)
}

export function setStoredOrderId(numero, orderId) {
  localStorage.setItem(PREFIX + numero, orderId)
}

export function clearStoredOrderId(numero) {
  localStorage.removeItem(PREFIX + numero)
}
