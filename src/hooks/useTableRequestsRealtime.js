import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Solicitudes pendientes ("llamar mesero" / "pedir cuenta"), con realtime.
export function useTableRequestsRealtime(onNewRequest) {
  const [requests, setRequests] = useState([])

  const fetchPending = useCallback(async () => {
    const { data, error } = await supabase
      .from('table_requests')
      .select('*')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: true })

    if (!error) setRequests(data)
  }, [])

  async function resolveRequest(id) {
    await supabase.from('table_requests').update({ estado: 'atendido' }).eq('id', id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  useEffect(() => {
    fetchPending()

    const channel = supabase
      .channel('table-requests-admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'table_requests' },
        (payload) => {
          setRequests((prev) => [...prev, payload.new])
          onNewRequest?.()
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchPending, onNewRequest])

  return { requests, resolveRequest }
}
