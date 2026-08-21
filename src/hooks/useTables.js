import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useTables() {
  const [tables, setTables] = useState([])

  useEffect(() => {
    supabase
      .from('tables')
      .select('*')
      .order('numero', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setTables(data)
      })
  }, [])

  return tables
}
