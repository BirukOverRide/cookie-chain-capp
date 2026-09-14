import { type FC, useCallback, useState } from 'react'
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { MEMO_PROGRAM_ID, COOKIE_EXPLORER } from '../lib/constants'
import { shortAddr, statusColor } from '../lib/format'
import { useBalance } from '../hooks/useBalance'

type TxLog = {
  id: string
  kind: string
  status: 'pending' | 'confirmed' | 'error'
  sig?: string
  message: string
  at: number
}

export const OnChainActions: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected, signMessage } = useWallet()
  const { refresh: refreshBal } = useBalance()
  const [memo, setMemo] = useState('Hello Cookie Chain from CookieJar 🍪')
  const [tipTo, setTipTo] = useState('')
  const [tipAmt, setTipAmt] = useState('0.001')
  const [busy, setBusy] = useState<string | null>(null)
  const [logs, setLogs] = useState<TxLog[]>([])

  const push = useCallback((entry: Omit<TxLog, 'id' | 'at'>) => {
    const row: TxLog = { ...entry, id: crypto.randomUUID(), at: Date.now() }
    setLogs((prev) => [row, ...prev].slice(0, 12))
    return row.id
  }, [])

  const patch = useCallback((id: string, patch: Partial<TxLog>) => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }, [])

  const sendMemo = useCallback(async () => {
    if (!publicKey || !connected) return
    setBusy('memo')
    const id = push({ kind: 'Memo', status: 'pending', message: 'Awaiting wallet signature…' })
    try {
      const ix = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from(memo, 'utf8'),
      })
      const tx = new Transaction().add(ix)
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
      tx.recentBlockhash = blockhash
      tx.feePayer = publicKey
      const sig = await sendTransaction(tx, connection)
      patch(id, { message: 'Confirming…', sig })
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed')
      patch(id, { status: 'confirmed', message: `Memo landed: "${memo.slice(0, 48)}"`, sig })
      void refreshBal()
    } catch (e) {
      patch(id, { status: 'error', message: e instanceof Error ? e.message : String(e) })
    } finally {
      setBusy(null)
    }
  }, [publicKey, connected, memo, connection, sendTransaction, push, patch, refreshBal])

  const sendTip = useCallback(async () => {
    if (!publicKey || !connected) return
    setBusy('tip')
    const id = push({ kind: 'Tip', status: 'pending', message: 'Awaiting wallet signature…' })
    try {
      let dest: PublicKey
      try {
        dest = new PublicKey(tipTo.trim() || publicKey.toBase58())
      } catch {
        throw new Error('Invalid destination address')
      }
      const lamports = Math.round(parseFloat(tipAmt) * LAMPORTS_PER_SOL)
      if (!Number.isFinite(lamports) || lamports <= 0) throw new Error('Amount must be > 0')
      const tx = new Transaction().add(
        SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: dest, lamports }),
      )
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
      tx.recentBlockhash = blockhash
      tx.feePayer = publicKey
      const sig = await sendTransaction(tx, connection)
      patch(id, { message: 'Confirming…', sig })
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed')
      patch(id, {
        status: 'confirmed',
        message: `Sent ${tipAmt} COOK → ${shortAddr(dest.toBase58())}`,
        sig,
      })
      void refreshBal()
    } catch (e) {
      patch(id, { status: 'error', message: e instanceof Error ? e.message : String(e) })
    } finally {
      setBusy(null)
    }
  }, [publicKey, connected, tipTo, tipAmt, connection, sendTransaction, push, patch, refreshBal])

  const doSign = useCallback(async () => {
    if (!publicKey || !signMessage) {
      push({ kind: 'Sign', status: 'error', message: 'Wallet does not support signMessage' })
      return
    }
    setBusy('sign')
    const id = push({ kind: 'Sign', status: 'pending', message: 'Sign message in wallet…' })
    try {
      const msg = new TextEncoder().encode(`CookieJar auth @ ${new Date().toISOString()}`)
      const sig = await signMessage(msg)
      const hex = Array.from(sig)
        .slice(0, 16)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      patch(id, { status: 'confirmed', message: `Signed OK (${hex}…)` })
    } catch (e) {
      patch(id, { status: 'error', message: e instanceof Error ? e.message : String(e) })
    } finally {
      setBusy(null)
    }
  }, [publicKey, signMessage, push, patch])

  return (
    <section className="card">
      <div className="card-head">
        <h2>⛓️ On-chain actions</h2>
      </div>
      {!connected && <p className="muted">Connect Nightly (or another wallet) to send txs.</p>}

      <div className="action-block">
        <h3>Guestbook memo</h3>
        <p className="muted small">Writes an SPL Memo instruction on Cookie Chain.</p>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          maxLength={200}
          disabled={!connected || busy !== null}
        />
        <button type="button" className="btn primary" disabled={!connected || busy !== null} onClick={() => void sendMemo()}>
          {busy === 'memo' ? 'Sending…' : 'Post memo tx'}
        </button>
      </div>

      <div className="action-block">
        <h3>Tip COOK</h3>
        <p className="muted small">Native transfer. Leave address empty to self-transfer (smoke test).</p>
        <input
          placeholder="Destination (optional = self)"
          value={tipTo}
          onChange={(e) => setTipTo(e.target.value)}
          disabled={!connected || busy !== null}
        />
        <input
          type="number"
          step="0.0001"
          min="0"
          value={tipAmt}
          onChange={(e) => setTipAmt(e.target.value)}
          disabled={!connected || busy !== null}
        />
        <button type="button" className="btn primary" disabled={!connected || busy !== null} onClick={() => void sendTip()}>
          {busy === 'tip' ? 'Sending…' : 'Send tip tx'}
        </button>
      </div>

      <div className="action-block">
        <h3>Sign message</h3>
        <button type="button" className="btn" disabled={!connected || busy !== null} onClick={() => void doSign()}>
          {busy === 'sign' ? 'Signing…' : 'Sign off-chain message'}
        </button>
      </div>

      <div className="activity">
        <h3>Activity</h3>
        {logs.length === 0 && <p className="muted small">No txs yet.</p>}
        <ul>
          {logs.map((l) => (
            <li key={l.id}>
              <span className="dot" style={{ background: statusColor(l.status) }} />
              <div>
                <strong>{l.kind}</strong> · <span className="status">{l.status}</span>
                <div className="muted small">{l.message}</div>
                {l.sig && (
                  <a href={`${COOKIE_EXPLORER}/tx/${l.sig}`} target="_blank" rel="noreferrer" className="small">
                    {shortAddr(l.sig, 8)} ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
