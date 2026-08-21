import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useTableRequest(tableId) {
  const [sending, setSending] = useState(null) // 'mesero' | 'cuenta' | null

  async function createRequest(tipo) {
    setSending(tipo)
    const { error } = await supabase
      .from('table_requests')
      .insert({ table_id: tableId, tipo })
    setSending(null)
    return { error }
  }

  return { createRequest, sending }
}
