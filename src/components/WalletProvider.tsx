import { type FC, type ReactNode, useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { NightlyWalletAdapter } from '@solana/wallet-adapter-wallets'
import { COOKIE_RPC } from '../lib/constants'

type Props = { children: ReactNode }

/**
 * Cookie Chain uses Solana-compatible Wallet Standard.
 * Nightly is REQUIRED by the Superteam Earn listing.
 * Wallet Standard discovery also picks up Phantom / Solflare if installed.
 */
export const CookieWalletProvider: FC<Props> = ({ children }) => {
  const endpoint = useMemo(() => COOKIE_RPC, [])
  const wallets = useMemo(() => [new NightlyWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
