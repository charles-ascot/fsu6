import React from 'react'
import { RefreshCw } from 'lucide-react'

export default function Header({ lastRefresh, onRefresh, loading }) {
  const timeStr = lastRefresh
    ? lastRefresh.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--'

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(13,27,42,0.95)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32,
          background: 'var(--accent)',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--display)',
          fontWeight: 800,
          fontSize: 16,
          color: '#fff',
          letterSpacing: '-0.02em',
        }}>C</div>
        <div>
          <div style={{
            fontFamily: 'var(--display)',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.08em',
            color: 'var(--text)',
          }}>CHIMERA</div>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            marginTop: -2,
          }}>PERFORMANCE INTELLIGENCE</div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
        }}>
          LAST UPDATE <span style={{ color: 'var(--accent-bright)', marginLeft: 6 }}>{timeStr}</span>
        </div>
        <button
          onClick={onRefresh}
          style={{
            background: 'var(--navy-light)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer',
            color: 'var(--text-dim)',
            fontSize: 12,
            fontFamily: 'var(--sans)',
            transition: 'all 0.15s',
          }}
        >
          <RefreshCw size={12} style={{
            animation: loading ? 'spin 1s linear infinite' : 'none',
          }} />
          Refresh
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </header>
  )
}
