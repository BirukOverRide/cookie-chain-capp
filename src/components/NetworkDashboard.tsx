import type { FC } from 'react'
import { useNetworkStats } from '../hooks/useNetworkStats'
import { COOKIE_EXPLORER, COOKIE_RPC } from '../lib/constants'

export const NetworkDashboard: FC = () => {
  const stats = useNetworkStats()

  return (
    <section className="card">
      <div className="card-head">
        <h2>🍪 Network pulse</h2>
        <button type="button" className="btn ghost" onClick={() => stats.refresh()} disabled={stats.loading}>
          Refresh
        </button>
      </div>
      <p className="muted small">
        Live data from <code>{COOKIE_RPC}</code>
      </p>
      {stats.error && <p className="error">RPC error: {stats.error}</p>}
      <div className="stat-grid">
        <Stat label="Health" value={stats.health ?? '…'} ok={stats.health === 'ok'} />
        <Stat label="Slot" value={stats.slot?.toLocaleString() ?? '…'} />
        <Stat label="Block height" value={stats.blockHeight?.toLocaleString() ?? '…'} />
        <Stat label="Validator" value={stats.version ?? '…'} />
        <Stat
          label="Genesis"
          value={stats.genesisOk == null ? '…' : stats.genesisOk ? 'Cookie Chain ✓' : 'Mismatch ✗'}
          ok={stats.genesisOk === true}
        />
        <Stat
          label="Updated"
          value={stats.updatedAt ? new Date(stats.updatedAt).toLocaleTimeString() : '…'}
        />
      </div>
      <a className="link" href={COOKIE_EXPLORER} target="_blank" rel="noreferrer">
        Open CookieScan explorer →
      </a>
    </section>
  )
}

const Stat: FC<{ label: string; value: string; ok?: boolean }> = ({ label, value, ok }) => (
  <div className={`stat ${ok === true ? 'ok' : ok === false ? 'bad' : ''}`}>
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
)
