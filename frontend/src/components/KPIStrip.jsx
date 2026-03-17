import React from 'react'
import { TrendingUp, Target, BarChart2, Hash } from 'lucide-react'

function KPICard({ icon: Icon, label, value, sub, color, delay, loading }) {
  return (
    <div className={`fade-up fade-up-${delay}`} style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2, background: color,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon size={13} color={color} />
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
        }}>{label}</span>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 36, width: '70%' }} />
      ) : (
        <div style={{
          fontFamily: 'var(--display)',
          fontSize: 32,
          fontWeight: 700,
          color,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>{value}</div>
      )}

      {sub && !loading && (
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
        }}>{sub}</div>
      )}
    </div>
  )
}

export default function KPIStrip({ summary, loading }) {
  const pl = summary?.total_pl ?? 0
  const strike = summary?.strike_rate ?? 0
  const roi = summary?.roi ?? 0
  const total = summary?.total_bets ?? 0
  const wins = summary?.wins ?? 0
  const losses = summary?.losses ?? 0

  const plColor = pl >= 0 ? 'var(--teal)' : 'var(--red)'
  const formatPL = (v) => `${v >= 0 ? '+' : ''}£${Math.abs(v).toFixed(2)}`
  const formatPct = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
    }}>
      <KPICard
        icon={TrendingUp}
        label="TOTAL P&L"
        value={loading ? '--' : formatPL(pl)}
        sub={`${wins}W — ${losses}L`}
        color={plColor}
        delay={1}
        loading={loading}
      />
      <KPICard
        icon={Target}
        label="STRIKE RATE"
        value={loading ? '--' : `${strike.toFixed(1)}%`}
        sub="Winners / total bets"
        color="var(--accent-bright)"
        delay={2}
        loading={loading}
      />
      <KPICard
        icon={BarChart2}
        label="ROI"
        value={loading ? '--' : formatPct(roi)}
        sub="Return on investment"
        color={roi >= 0 ? 'var(--teal)' : 'var(--red)'}
        delay={3}
        loading={loading}
      />
      <KPICard
        icon={Hash}
        label="TOTAL BETS"
        value={loading ? '--' : total.toLocaleString()}
        sub="All time"
        color="var(--text-dim)"
        delay={4}
        loading={loading}
      />
    </div>
  )
}
