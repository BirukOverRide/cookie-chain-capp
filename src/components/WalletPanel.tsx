import type { FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useBalance } from '../hooks/useBalance'
import { shortAddr, lamportsToCook } from '../lib/format'
import { COOKIE_BRIDGE, COOKIE_EXPLORER } from '../lib/constants'

export const WalletPanel: FC = () => {
  const { publicKey, connected, wallet } = useWallet()
  const { lamports, loading, error, refresh } = useBalance()

  return (
    <section className="card accent">
      <div className="card-head">
        <h2>🔌 Wallet</h2>
        <WalletMultiButton />
      </div>
      <p className="muted">
        <strong>Nightly support is required</strong> for this bounty. Install{' '}
        <a href="https://nightly.app" target="_blank" rel="noreferrer">
          Nightly
        </a>
        , switch/add Cookie Chain RPC (<code>https://rpc.cookiescan.io</code>), then connect.
        Phantom / other Wallet Standard wallets also appear if installed.
      </p>
      {!connected && (
        <div className="callout">
          Bridge COOK from Solana if you need gas:{' '}
          <a href={COOKIE_BRIDGE} target="_blank" rel="noreferrer">
            bridge.cookiescan.io
          </a>
        </div>
      )}
      {connected && publicKey && (
        <div className="wallet-meta">
          <div className="row">
            <span className="label">Adapter</span>
            <span>{wallet?.adapter.name ?? '—'}</span>
          </div>
          <div className="row">
            <span className="label">Address</span>
            <a
              href={`${COOKIE_EXPLORER}/account/${publicKey.toBase58()}`}
              target="_blank"
              rel="noreferrer"
              title={publicKey.toBase58()}
            >
              {shortAddr(publicKey.toBase58(), 6)}
            </a>
          </div>
          <div className="row">
            <span className="label">cCOOK balance</span>
            <span>
              {loading && lamports == null ? '…' : lamportsToCook(lamports ?? 0)} COOK{' '}
              <button type="button" className="btn tiny ghost" onClick={() => void refresh()}>
                ↻
              </button>
            </span>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </section>
  )
}
