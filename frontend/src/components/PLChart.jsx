import React, { useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const v = payload[0].value
  return (
    <div style={{
      background: 'var(--navy-mid)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: 'var(--mono)',
      fontSize: 11,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: v >= 0 ? 'var(--teal)' : 'var(--red)', fontSize: 14, fontWeight: 500 }}>
        {v >= 0 ? '+' : ''}£{v.toFixed(2)}
      </div>
    </div>
  )
}

export default function PLChart({ sessions, loading }) {
  const chartData = useMemo(() => {
    if (!sessions) return []
    let cumulative = 0
    return sessions
      .slice()
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .map(s => {
        cumulative += (s.total_pl ?? 0)
        return {
          date: new Date(s.start_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          pl: parseFloat(cumulative.toFixed(2)),
          sessionPL: parseFloat((s.total_pl ?? 0).toFixed(2)),
        }
      })
  }, [sessions])

  const maxAbs = Math.max(...chartData.map(d => Math.abs(d.pl)), 1)
  const isPositive = chartData.length > 0 && chartData[chartData.length - 1].pl >= 0

  return (
    <div className="fade-up fade-up-5" style={{
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{
            fontFamily: 'var(--display)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--text)',
            letterSpacing: '0.02em',
          }}>Cumulative P&L</div>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            marginTop: 4,
            letterSpacing: '0.08em',
          }}>ALL SESSIONS · ROLLING TOTAL</div>
        </div>
        {chartData.length > 0 && (
          <div style={{
            fontFamily: 'var(--display)',
            fontSize: 24,
            fontWeight: 700,
            color: isPositive ? 'var(--teal)' : 'var(--red)',
          }}>
            {isPositive ? '+' : ''}£{chartData[chartData.length - 1].pl.toFixed(2)}
          </div>
        )}
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 220 }} />
      ) : chartData.length === 0 ? (
        <div style={{
          height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: 11,
        }}>NO SESSION DATA</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="plGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#17A589' : '#E74C3C'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? '#17A589' : '#E74C3C'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: 'var(--mono)', fontSize: 9, fill: 'var(--text-muted)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: 'var(--mono)', fontSize: 9, fill: 'var(--text-muted)' }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `£${v}`}
              domain={[-maxAbs * 1.1, maxAbs * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="pl"
              stroke={isPositive ? 'var(--teal)' : 'var(--red)'}
              strokeWidth={2}
              fill="url(#plGrad)"
              dot={false}
              activeDot={{ r: 4, fill: isPositive ? 'var(--teal)' : 'var(--red)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
