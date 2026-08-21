import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Ingresos del turno + plato más vendido, a partir de las órdenes de hoy
// que ya trae useOrdersRealtime (se recalcula cuando cambia la cantidad).
export function useShiftStats(orders) {
  const [topSeller, setTopSeller] = useState(null)

  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const orderIds = orders.map((o) => o.id).join(',')

  useEffect(() => {
    if (orders.length === 0) {
      setTopSeller(null)
      return
    }

    let cancelled = false

    supabase
      .from('order_items')
      .select('cantidad, menu_items ( nombre )')
      .in(
        'order_id',
        orders.map((o) => o.id)
      )
      .then(({ data, error }) => {
        if (cancelled || error || !data) return

        const counts = new Map()
        for (const item of data) {
          const nombre = item.menu_items?.nombre
          if (!nombre) continue
          counts.set(nombre, (counts.get(nombre) ?? 0) + item.cantidad)
        }

        let best = null
        for (const [nombre, cantidad] of counts) {
          if (!best || cantidad > best.cantidad) best = { nombre, cantidad }
        }
        setTopSeller(best)
      })

    return () => {
      cancelled = true
    }
    // orderIds (no `orders`) como dependencia: es la clave estable, evita refetch en cada render.
  }, [orderIds])

  return { revenue, topSeller }
}
