import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useTable(numero) {
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('numero', numero)
        .maybeSingle()

      if (cancelled) return

      if (error) setError(error.message)
      setTable(data)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [numero])

  return { table, loading, error }
}
