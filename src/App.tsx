import { CookieWalletProvider } from './components/WalletProvider'
import { WalletPanel } from './components/WalletPanel'
import { NetworkDashboard } from './components/NetworkDashboard'
import { OnChainActions } from './components/OnChainActions'
import {
  APP_NAME,
  APP_TAGLINE,
  COOKIE_BRIDGE,
  COOKIE_HOME,
  COOKIEBOX,
  COOKIESWAP,
  COOKIE_TELEGRAM,
  COOKIE_DOCS,
} from './lib/constants'
import './App.css'

export default function App() {
  return (
    <CookieWalletProvider>
      <div className="app">
        <header className="hero">
          <div className="brand">
            <span className="logo" aria-hidden>
              🍪
            </span>
            <div>
              <h1>{APP_NAME}</h1>
              <p>{APP_TAGLINE}</p>
            </div>
          </div>
          <p className="hero-copy">
            Minimal cApp on <strong>Cookie Chain</strong> (SVM). Connect{' '}
            <strong>Nightly</strong>, post on-chain memos, tip COOK, and watch live network stats —
            built for the Superteam Earn listing.
          </p>
          <nav className="links">
            <a href={COOKIE_HOME} target="_blank" rel="noreferrer">
              cookiechain.wtf
            </a>
            <a href={COOKIE_BRIDGE} target="_blank" rel="noreferrer">
              Bridge
            </a>
            <a href={COOKIEBOX} target="_blank" rel="noreferrer">
              Cookiebox
            </a>
            <a href={COOKIESWAP} target="_blank" rel="noreferrer">
              Cookieswap
            </a>
            <a href={COOKIE_DOCS} target="_blank" rel="noreferrer">
              Docs
            </a>
            <a href={COOKIE_TELEGRAM} target="_blank" rel="noreferrer">
              Telegram
            </a>
          </nav>
        </header>

        <main className="grid">
          <WalletPanel />
          <NetworkDashboard />
          <OnChainActions />
        </main>

        <footer className="foot">
          <p>
            RPC <code>https://rpc.cookiescan.io</code> · Need gas?{' '}
            <a href={COOKIE_BRIDGE} target="_blank" rel="noreferrer">
              Bridge Solana → Cookie Chain
            </a>
          </p>
          <p className="muted small">BirukOverRide · Superteam Earn · Cookie Chain cApp bounty</p>
        </footer>
      </div>
    </CookieWalletProvider>
  )
}
