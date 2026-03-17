import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ErrorBanner({ message }) {
  return (
    <div style={{
      background: 'rgba(231,76,60,0.1)',
      borderBottom: '1px solid rgba(231,76,60,0.2)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <AlertTriangle size={14} color="var(--red)" />
      <span style={{
        fontFamily: 'var(--mono)',
        fontSize: 11,
        color: 'var(--red)',
        letterSpacing: '0.04em',
      }}>
        API ERROR — {message}. Check VITE_API_KEY and VITE_API_BASE environment variables.
      </span>
    </div>
  )
}
