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
      .select('id, cantidad, nota, menu_items ( nombre, precio )')
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

  return { items, loading }
}
