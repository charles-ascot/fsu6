import React from 'react'
import { Activity, Globe, Coins } from 'lucide-react'

export default function EngineStatus({ state, loading }) {
  const isRunning = state?.engine_running ?? false
  const countries = state?.countries ?? []
  const pointValue = state?.point_value ?? '--'
  const isDryRun = state?.dry_run ?? false

  return (
    <div className="fade-up" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingTop: 24,
      flexWrap: 'wrap',
    }}>
      {/* Running status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: isRunning ? 'rgba(23,165,137,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isRunning ? 'rgba(23,165,137,0.3)' : 'var(--border)'}`,
        borderRadius: 20,
        padding: '6px 14px',
      }}>
        <div style={{
          width: 7, height: 7,
          borderRadius: '50%',
          background: isRunning ? 'var(--teal)' : 'var(--text-muted)',
          animation: isRunning ? 'pulse-dot 2s infinite' : 'none',
        }} />
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          color: isRunning ? 'var(--teal)' : 'var(--text-muted)',
        }}>
          {loading ? '...' : isRunning ? 'ENGINE LIVE' : 'ENGINE OFFLINE'}
        </span>
      </div>

      {/* Dry run badge */}
      {isDryRun && (
        <div style={{
          background: 'rgba(212,168,67,0.12)',
          border: '1px solid rgba(212,168,67,0.3)',
          borderRadius: 20,
          padding: '6px 14px',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          color: 'var(--gold)',
        }}>
          DRY RUN
        </div>
      )}

      {/* Countries */}
      {countries.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '6px 14px',
        }}>
          <Globe size={11} color="var(--text-muted)" />
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            color: 'var(--text-dim)',
          }}>
            {countries.join(' · ')}
          </span>
        </div>
      )}

      {/* Point value */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '6px 14px',
      }}>
        <Coins size={11} color="var(--text-muted)" />
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          color: 'var(--text-dim)',
        }}>
          £{pointValue}/pt
        </span>
      </div>
    </div>
  )
}
