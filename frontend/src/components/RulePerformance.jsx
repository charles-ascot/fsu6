import React, { useMemo } from 'react'

const RULE_COLORS = {
  'RULE_1': '#2E6DA4',
  'RULE_2': '#17A589',
  'RULE_3A': '#D4A843',
  'RULE_3B': '#9B59B6',
  'JOFS':   '#E67E22',
}
const RULE_LABELS = {
  'RULE_1':  'Rule 1',
  'RULE_2':  'Rule 2',
  'RULE_3A': 'Rule 3A',
  'RULE_3B': 'Rule 3B',
  'JOFS':    'JOFS',
}

export default function RulePerformance({ bets, loading }) {
  const rules = useMemo(() => {
    if (!bets) return []
    const map = {}
    bets.forEach(b => {
      const r = b.rule || 'UNKNOWN'
      if (!map[r]) map[r] = { rule: r, wins: 0, losses: 0, pl: 0 }
      if (b.settled) {
        const won = (b.pl ?? 0) > 0
        won ? map[r].wins++ : map[r].losses++
        map[r].pl += (b.pl ?? 0)
      }
    })
    return Object.values(map).sort((a, b) => b.wins + b.losses - a.wins - a.losses)
  }, [bets])

  const maxBets = Math.max(...rules.map(r => r.wins + r.losses), 1)

  return (
    <div style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px',
      flex: 1,
    }}>
      <div style={{
        fontFamily: 'var(--display)',
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: 4,
      }}>Rule Performance</div>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 9,
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        marginBottom: 16,
      }}>SETTLED BETS BY RULE</div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 32 }} />)}
        </div>
      ) : rules.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 10 }}>
          NO DATA
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rules.map(r => {
            const total = r.wins + r.losses
            const strike = total > 0 ? (r.wins / total * 100).toFixed(0) : 0
            const color = RULE_COLORS[r.rule] || '#555'
            const barWidth = total / maxBets * 100
            const pl = r.pl
            return (
              <div key={r.rule}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-dim)' }}>
                      {RULE_LABELS[r.rule] || r.rule}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-muted)' }}>
                      {strike}%
                    </span>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 9,
                      color: pl >= 0 ? 'var(--teal)' : 'var(--red)',
                    }}>
                      {pl >= 0 ? '+' : ''}£{pl.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 3, height: 4 }}>
                  <div style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    background: color,
                    borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 9,
                  color: 'var(--text-muted)', marginTop: 3,
                }}>
                  {r.wins}W · {r.losses}L · {total} bets
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
