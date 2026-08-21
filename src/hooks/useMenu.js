import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useMenu() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('disponible', true)
        .order('categoria', { ascending: true })
        .order('nombre', { ascending: true })

      if (cancelled) return

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const grouped = data.reduce((acc, item) => {
        const bucket = acc.find((c) => c.categoria === item.categoria)
        if (bucket) bucket.items.push(item)
        else acc.push({ categoria: item.categoria, items: [item] })
        return acc
      }, [])

      setCategories(grouped)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { categories, loading, error }
}
