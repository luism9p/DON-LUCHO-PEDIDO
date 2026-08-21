import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// Todos los pedidos del día, con suscripción realtime + sonido en pedidos nuevos.
export function useOrdersRealtime() {
  const [orders, setOrders] = useState([])
  const [lastInsertedId, setLastInsertedId] = useState(null)
  const audioCtxRef = useRef(null)

  const playAlert = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch {
      // Autoplay puede estar bloqueado hasta la primera interacción; se ignora.
    }
  }, [])

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
