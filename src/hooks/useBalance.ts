import { useCallback, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

export function useBalance() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [lamports, setLamports] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!publicKey) {
      setLamports(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const bal = await connection.getBalance(publicKey, 'confirmed')
      setLamports(bal)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [connection, publicKey])

  useEffect(() => {
    void refresh()
    if (!publicKey) return
    const id = setInterval(() => void refresh(), 10000)
    return () => clearInterval(id)
  }, [refresh, publicKey])

  return { lamports, loading, error, refresh }
}
