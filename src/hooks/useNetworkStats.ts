import { useCallback, useEffect, useState } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import { GENESIS_HASH } from '../lib/constants'

export type NetworkStats = {
  slot: number | null
  blockHeight: number | null
  health: string | null
  version: string | null
  genesisOk: boolean | null
  loading: boolean
  error: string | null
  updatedAt: number | null
}

export function useNetworkStats(pollMs = 8000): NetworkStats & { refresh: () => void } {
  const { connection } = useConnection()
  const [stats, setStats] = useState<NetworkStats>({
    slot: null,
    blockHeight: null,
    health: null,
    version: null,
    genesisOk: null,
    loading: true,
    error: null,
    updatedAt: null,
  })

  const refresh = useCallback(async () => {
    try {
      const [slot, blockHeight, version, genesis, healthRes] = await Promise.all([
        connection.getSlot('confirmed'),
        connection.getBlockHeight('confirmed'),
        connection.getVersion(),
        connection.getGenesisHash(),
        // getHealth is not on Connection; hit JSON-RPC directly
        fetch(connection.rpcEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getHealth' }),
        }).then((r) => r.json()),
      ])
      setStats({
        slot,
        blockHeight,
        version: version['solana-core'] ?? JSON.stringify(version),
        health: (healthRes?.result as string) ?? 'unknown',
        genesisOk: genesis === GENESIS_HASH,
        loading: false,
        error: null,
        updatedAt: Date.now(),
      })
    } catch (e) {
      setStats((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : String(e),
      }))
    }
  }, [connection])

  useEffect(() => {
    void refresh()
    const id = setInterval(() => void refresh(), pollMs)
    return () => clearInterval(id)
  }, [refresh, pollMs])

  return { ...stats, refresh }
}
