import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Sigue en vivo el estado de un pedido puntual (pantalla "pedido enviado").
export function useOrderTracking(orderId) {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (!orderId) return

    let cancelled = false

    supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
      .then(({ data }) => {
        if (!cancelled) setOrder(data)
      })

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => setOrder(payload.new)
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [orderId])

  return order
}
