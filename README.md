# CookieJar — Cookie Chain cApp

Minimal wallet-connected **cApp** on [Cookie Chain](https://www.cookiechain.wtf) (SVM) for the Superteam Earn listing  
[Create an App on Cookie Chain](https://superteam.fun/earn/listing/create-an-app-on-cookie-chain-app/).

**Author:** BirukOverRide

## What it does

- **Nightly wallet connect** (required) via `@solana/wallet-adapter` + Wallet Standard
- Shows connected address + **cCOOK balance** on Cookie Chain RPC
- **Live network dashboard** (health, slot, block height, genesis check)
- **On-chain txs:** SPL Memo guestbook + native COOK tip/transfer with confirm + explorer links
- Sign-message demo + activity feed with status feedback
- Links to Bridge, Cookiebox, Cookieswap, Docs

RPC: `https://rpc.cookiescan.io` · Explorer: https://cookiescan.io · Bridge: https://bridge.cookiescan.io

## Run locally

```bash
cd cookie-chain-capp
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

## Build & deploy

```bash
npm run build
# dist/ → deploy to Vercel / Netlify / Cloudflare Pages / GitHub Pages
```

**Vercel (example):**

```bash
npx vercel --prod
```

Or connect the GitHub repo in the Vercel/Netlify dashboard (framework: Vite, output: `dist`).

## Wallet setup (Nightly)

1. Install [Nightly](https://nightly.app) (Chrome extension / mobile).
2. Add / select Cookie Chain custom RPC: `https://rpc.cookiescan.io`.
3. Bridge gas if needed: https://bridge.cookiescan.io
4. Open the app → **Select Wallet** → **Nightly** → approve connect.
5. Post a memo or send a tiny tip; confirm status in Activity + CookieScan.

Phantom / other Wallet Standard wallets may also appear if installed.

## Submission checklist (Superteam Earn)

- [ ] App builds (`npm run build`) and is **publicly deployed** (live URL)
- [ ] GitHub repo is **public / open source** with this README
- [ ] Nightly connect works; address shown
- [ ] At least one real Cookie Chain tx (memo or tip) confirmed on CookieScan
- [ ] Note any program/token addresses in the submission form (N/A for memo/system transfers)
- [ ] **X thread**: what it does, how to use, link Bridge if relevant
- [ ] Share X thread in Cookie Chain Telegram: https://t.me/TheCookieNetChain
- [ ] Submit on listing: Live URL + GitHub + addresses

Deadline: **2026-09-22** · Winners by ~2026-09-28 · Prizes: 500 + 500 USDC

## Stack

Vite · React · TypeScript · `@solana/web3.js` · `@solana/wallet-adapter-*` (Nightly)

## License

MIT
