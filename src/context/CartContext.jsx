import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem } = action
      const existing = state.find(
        (line) => line.menuItemId === menuItem.id && line.nota === ''
      )
      if (existing) {
        return state.map((line) =>
          line === existing ? { ...line, cantidad: line.cantidad + 1 } : line
        )
      }
      return [
        ...state,
        {
          lineId: crypto.randomUUID(),
          menuItemId: menuItem.id,
          nombre: menuItem.nombre,
          precio: menuItem.precio,
          cantidad: 1,
          nota: '',
        },
      ]
    }
    case 'SET_QUANTITY': {
      const cantidad = Math.max(0, action.cantidad)
      if (cantidad === 0) {
        return state.filter((line) => line.lineId !== action.lineId)
      }
      return state.map((line) =>
        line.lineId === action.lineId ? { ...line, cantidad } : line
      )
    }
    case 'SET_NOTE': {
      return state.map((line) =>
        line.lineId === action.lineId ? { ...line, nota: action.nota } : line
      )
    }
    case 'REMOVE_ITEM':
      return state.filter((line) => line.lineId !== action.lineId)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const value = useMemo(() => {
    const total = items.reduce((sum, line) => sum + line.precio * line.cantidad, 0)
    const count = items.reduce((sum, line) => sum + line.cantidad, 0)
    return {
      items,
      total,
      count,
      addItem: (menuItem) => dispatch({ type: 'ADD_ITEM', menuItem }),
      setQuantity: (lineId, cantidad) =>
        dispatch({ type: 'SET_QUANTITY', lineId, cantidad }),
      setNote: (lineId, nota) => dispatch({ type: 'SET_NOTE', lineId, nota }),
      removeItem: (lineId) => dispatch({ type: 'REMOVE_ITEM', lineId }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
