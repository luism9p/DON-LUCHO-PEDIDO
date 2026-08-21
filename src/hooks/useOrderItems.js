import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useOrderItems(orderId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setItems([])
      return
    }

    let cancelled = false
    setLoading(true)

    supabase
      .from('order_items')
      .select('id, cantidad, nota, listo, menu_items ( nombre, precio )')
      .eq('order_id', orderId)
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) setItems(data)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [orderId])

  async function toggleListo(itemId, listo) {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, listo } : it)))
    await supabase.from('order_items').update({ listo }).eq('id', itemId)
  }

  return { items, loading, toggleListo }
}
