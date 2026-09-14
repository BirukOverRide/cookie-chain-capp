export function shortAddr(addr: string, n = 4): string {
  if (!addr || addr.length < n * 2 + 3) return addr
  return `${addr.slice(0, n)}…${addr.slice(-n)}`
}

export function lamportsToCook(lamports: number | bigint, decimals = 9): string {
  const v = Number(lamports) / 10 ** decimals
  if (!Number.isFinite(v)) return '—'
  if (v === 0) return '0'
  if (v < 0.0001) return v.toExponential(2)
  return v.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

export function statusColor(status: string): string {
  switch (status) {
    case 'confirmed':
    case 'finalized':
    case 'success':
      return '#22c55e'
    case 'pending':
    case 'processing':
      return '#f59e0b'
    case 'error':
    case 'failed':
      return '#ef4444'
    default:
      return '#94a3b8'
  }
}
