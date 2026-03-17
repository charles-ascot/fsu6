import React, { useMemo } from 'react'
import { Trophy } from 'lucide-react'

export default function BestDay({ sessions, loading }) {
  const best = useMemo(() => {
    if (!sessions || sessions.length === 0) return null
    return sessions.reduce((best, s) => {
      if (!best || (s.total_pl ?? 0) > (best.total_pl ?? 0)) return s
      return best
    }, null)
  }, [sessions])

  const date = best?.start_time
    ? new Date(best.start_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '--'
  const pl = best?.total_pl ?? 0
  const strike = best?.strike_rate ?? 0
  const wins = best?.wins ?? 0
  const losses = best?.losses ?? 0
  const roi = best?.roi ?? 0

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(23,165,137,0.12), rgba(46,109,164,0.08))',
      border: '1px solid rgba(23,165,137,0.2)',
      borderRadius: 12,
      padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Trophy size={13} color="var(--gold)" />
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.1em',
          color: 'var(--gold)',
        }}>BEST SESSION</span>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 60 }} />
      ) : best ? (
        <>
          <div style={{
            fontFamily: 'var(--display)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--teal)',
            lineHeight: 1,
          }}>+£{pl.toFixed(2)}</div>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            marginTop: 6,
          }}>{date}</div>
          <div style={{
            display: 'flex', gap: 16, marginTop: 12,
            fontFamily: 'var(--mono)', fontSize: 10,
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>STRIKE</div>
              <div style={{ color: 'var(--teal)', marginTop: 2 }}>{strike.toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>ROI</div>
              <div style={{ color: 'var(--teal)', marginTop: 2 }}>+{roi.toFixed(1)}%</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>RECORD</div>
              <div style={{ color: 'var(--text-dim)', marginTop: 2 }}>{wins}W–{losses}L</div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 10 }}>
          NO SESSIONS YET
        </div>
      )}
    </div>
  )
}
