import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAlertSound } from './useAlertSound'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// Todos los pedidos del día, con suscripción realtime + sonido en pedidos nuevos.
export function useOrdersRealtime() {
  const [orders, setOrders] = useState([])
  const [lastInsertedId, setLastInsertedId] = useState(null)
  const playAlert = useAlertSound()

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startOfToday())
      .order('created_at', { ascending: true })

    if (!error) setOrders(data)
  }, [])

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('orders-admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((prev) => [...prev, payload.new])
          setLastInsertedId(payload.new.id)
          playAlert()
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === payload.new.id ? payload.new : o))
          )
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchOrders, playAlert])

  return { orders, lastInsertedId, refresh: fetchOrders }
}
