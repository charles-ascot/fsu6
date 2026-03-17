import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.VITE_API_BASE || 'https://layengine.thync.online'
const KEY  = import.meta.env.VITE_API_KEY  || ''

async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-API-Key': KEY }
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export function useLayEngine(refreshInterval = 30000) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetch = useCallback(async () => {
    try {
      const [summary, sessions, bets, results, state] = await Promise.all([
        apiFetch('/api/data/summary'),
        apiFetch('/api/data/sessions'),
        apiFetch('/api/data/bets'),
        apiFetch('/api/data/results'),
        apiFetch('/api/data/state'),
      ])
      setData({ summary, sessions, bets, results, state })
      setLastRefresh(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, refreshInterval)
    return () => clearInterval(id)
  }, [fetch, refreshInterval])

  return { data, loading, error, lastRefresh, refresh: fetch }
}
