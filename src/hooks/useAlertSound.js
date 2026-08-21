import { useCallback, useEffect, useRef } from 'react'

// Beep corto reutilizable para alertas del panel admin (pedidos y solicitudes).
export function useAlertSound() {
  const audioCtxRef = useRef(null)

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close()
      audioCtxRef.current = null
    }
  }, [])

  return useCallback(() => {
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
}
