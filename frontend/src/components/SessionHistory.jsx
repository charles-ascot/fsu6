import React, { useMemo } from 'react'

export default function SessionHistory({ sessions, loading }) {
  const sorted = useMemo(() => {
    if (!sessions) return []
    return sessions
      .slice()
      .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
      .slice(0, 15)
  }, [sessions])

  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '24px',
      overflow: 'hidden',
    }}>
      <div style={{
        fontFamily: 'var(--display)',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: 4,
      }}>Session History</div>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        marginBottom: 16,
      }}>LAST 15 SESSIONS</div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 40 }} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 10 }}>
          NO SESSIONS YET
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sorted.map((s, i) => {
            const pl = s.total_pl ?? 0
            const strike = s.strike_rate ?? 0
            const wins = s.wins ?? 0
            const losses = s.losses ?? 0
            const date = new Date(s.start_time).toLocaleDateString('en-GB', {
              weekday: 'short', day: 'numeric', month: 'short'
            })
            const plPositive = pl >= 0

            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 12,
                    color: 'var(--text-dim)',
                  }}>{date}</div>
                  <div style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}>{wins}W · {losses}L · {(wins + losses)} bets</div>
                </div>

                {/* Strike rate bar */}
                <div style={{ width: 60 }}>
                  <div style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    color: 'var(--text-muted)',
                    marginBottom: 3,
                    textAlign: 'right',
                  }}>{strike.toFixed(0)}%</div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 2, height: 3 }}>
                    <div style={{
                      width: `${Math.min(strike, 100)}%`,
                      height: '100%',
                      background: strike >= 60 ? 'var(--teal)' : strike >= 40 ? 'var(--gold)' : 'var(--red)',
                      borderRadius: 2,
                    }} />
                  </div>
                </div>

                {/* P&L */}
                <div style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: plPositive ? 'var(--teal)' : 'var(--red)',
                  minWidth: 72,
                  textAlign: 'right',
                }}>
                  {plPositive ? '+' : ''}£{pl.toFixed(2)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
