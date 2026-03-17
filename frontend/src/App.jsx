import React, { useState } from 'react'
import { useLayEngine } from './hooks/useLayEngine'
import Header from './components/Header'
import KPIStrip from './components/KPIStrip'
import PLChart from './components/PLChart'
import RulePerformance from './components/RulePerformance'
import BestDay from './components/BestDay'
import RecentBets from './components/RecentBets'
import SessionHistory from './components/SessionHistory'
import EngineStatus from './components/EngineStatus'
import ErrorBanner from './components/ErrorBanner'

export default function App() {
  const { data, loading, error, lastRefresh, refresh } = useLayEngine(30000)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Header lastRefresh={lastRefresh} onRefresh={refresh} loading={loading} />

      {error && <ErrorBanner message={error} />}

      <main style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 24px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        {/* Engine status pill row */}
        <EngineStatus state={data?.state} loading={loading} />

        {/* KPI strip */}
        <KPIStrip summary={data?.summary} loading={loading} />

        {/* Main charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <PLChart sessions={data?.sessions} loading={loading} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <BestDay results={data?.results} sessions={data?.sessions} loading={loading} />
            <RulePerformance bets={data?.bets} loading={loading} />
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <RecentBets bets={data?.bets} loading={loading} />
          <SessionHistory sessions={data?.sessions} loading={loading} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontFamily: 'var(--mono)',
        fontSize: 11,
        letterSpacing: '0.05em',
      }}>
        CHIMERA PLATFORM · CAPE BERKSHIRE LTD · CONFIDENTIAL
        <span style={{ margin: '0 12px', opacity: 0.3 }}>|</span>
        Born from complexity. Engineered for certainty.
      </footer>
    </div>
  )
}
