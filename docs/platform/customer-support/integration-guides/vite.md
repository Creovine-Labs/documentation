---
sidebar_position: 3
title: Vite + React integration guide
description: Add Lira support to a Vite + React app in ~5 minutes.
---

# Vite + React integration guide

This guide adds a full support experience at `yourapp.com/support` in a Vite + React app.

**Time:** ~5 minutes.

---

## Step 1 — Scaffold the support component

```bash
npx @liraintelligence/support init --org-id=YOUR_ORG_ID
```

Replace `YOUR_ORG_ID` with your value from **Lira Settings → Organization**.

The CLI drops a `src/Support.tsx` file you can mount in your router.

---

## Step 2 — Install the package

```bash
npm install @liraintelligence/support
```

---

## Step 3 — Set environment variable

Add this to `.env`:

```env
VITE_LIRA_ORG_ID=org-xxxxxxxxxxxx
```

Restart `npm run dev` after editing `.env`.

---

## Step 4 — Mount in your router

Add a route for `<Support />` in your React Router (or whatever router you use):

```tsx
// src/App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Support } from './Support'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## Step 5 — Run it

```bash
npm run dev
```

Open `http://localhost:5173/support`.

---

## Identified visitors

Vite is frontend-only, so HMAC signing needs to happen on whatever backend you have (Express, Hono, your existing API). Wherever that is, add an endpoint that signs the visitor email:

```ts
// On your backend (any Node framework)
import crypto from 'node:crypto'

export function signLiraVisitor(email: string): string {
  return crypto
    .createHmac('sha256', process.env.LIRA_WIDGET_SECRET!)
    .update(email.trim().toLowerCase())
    .digest('hex')
}
```

Expose this as an authenticated endpoint (e.g. `POST /api/lira/sign`). Then in your Vite app:

```tsx
const [identity, setIdentity] = useState<{ email: string; name: string; sig: string } | null>(null)

useEffect(() => {
  if (!user) return
  fetch('/api/lira/sign', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email }),
  })
    .then((r) => r.json())
    .then(({ sig }) => setIdentity({ email: user.email, name: user.name, sig }))
}, [user])
```

Pass `identity` to `<LiraProvider identity={identity}>`.

---

## Common pitfalls

**`import.meta.env.VITE_LIRA_ORG_ID` is undefined**
The `VITE_` prefix is required. Vite only exposes env vars that start with `VITE_` to client code. Restart `npm run dev` after adding the var.

**"window is not defined"**
Only relevant if you're using SSR (Vike, Astro, etc.) — wrap mount calls in a `useEffect` so they only run client-side.

**CORS error on `/api/lira/sign`**
Vite dev server proxies API calls. Configure `vite.config.ts` proxy:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:3001',
  },
},
```

---

## Next steps

- [Add the floating widget](/platform/customer-support/widget) on every other page
- [SDK API reference](/platform/customer-support/web-sdk)
