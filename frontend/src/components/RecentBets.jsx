import React, { useMemo } from 'react'

const RULE_SHORT = { RULE_1: 'R1', RULE_2: 'R2', RULE_3A: 'R3A', RULE_3B: 'R3B', JOFS: 'JF' }

export default function RecentBets({ bets, loading }) {
  const recent = useMemo(() => {
    if (!bets) return []
    return bets
      .slice()
      .sort((a, b) => new Date(b.placed_at || b.timestamp || 0) - new Date(a.placed_at || a.timestamp || 0))
      .slice(0, 20)
  }, [bets])

  return (
    <div className="fade-up fade-up-6" style={{
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
      }}>Recent Bets</div>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        marginBottom: 16,
      }}>LAST 20 PLACED</div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 28 }} />
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Time', 'Runner', 'Rule', 'Odds', 'Stake', 'P&L'].map(h => (
                  <th key={h} style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    textAlign: 'left',
                    padding: '0 8px 8px 0',
                    borderBottom: '1px solid var(--border)',
                    fontWeight: 400,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((bet, i) => {
                const pl = bet.pl ?? null
                const settled = bet.settled ?? (pl !== null)
                const plColor = !settled ? 'var(--text-muted)' : pl >= 0 ? 'var(--teal)' : 'var(--red)'
                const time = bet.placed_at || bet.timestamp
                  ? new Date(bet.placed_at || bet.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                  : '--'
                return (
                  <tr key={i} style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                  }}>
                    <td style={{ padding: '8px 8px 8px 0', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                      {time}
                    </td>
                    <td style={{
                      padding: '8px 8px 8px 0',
                      fontFamily: 'var(--sans)',
                      fontSize: 11,
                      color: 'var(--text-dim)',
                      maxWidth: 140,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {bet.runner_name || bet.selection || '--'}
                    </td>
                    <td style={{ padding: '8px 8px 8px 0' }}>
                      <span style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 9,
                        background: 'rgba(46,109,164,0.2)',
                        color: 'var(--accent-bright)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}>
                        {RULE_SHORT[bet.rule] || bet.rule || '--'}
                      </span>
                    </td>
                    <td style={{ padding: '8px 8px 8px 0', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                      {bet.odds?.toFixed(2) || '--'}
                    </td>
                    <td style={{ padding: '8px 8px 8px 0', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                      £{(bet.stake ?? bet.size ?? 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '8px 0 8px 0', fontFamily: 'var(--mono)', fontSize: 10, color: plColor }}>
                      {!settled ? '—' : `${pl >= 0 ? '+' : ''}£${pl.toFixed(2)}`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {recent.length === 0 && (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 10 }}>
              NO BETS YET
            </div>
          )}
        </div>
      )}
    </div>
  )
}
