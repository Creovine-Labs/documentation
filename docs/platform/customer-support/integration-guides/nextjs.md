---
sidebar_position: 2
title: Next.js integration guide
description: Add Lira support to a Next.js app (App Router or Pages) in ~5 minutes.
---

# Next.js integration guide

This guide walks you through adding a full support experience to a Next.js app at `yourapp.com/support`. Works with the App Router (recommended) and the Pages Router.

**You'll end up with:**
- A `/support` route that mounts the Lira chat + tickets UI
- A `/api/lira/sign` route that signs logged-in visitor emails server-side
- The floating chat widget on every page

**Time:** ~5 minutes.

---

## Step 1 — Scaffold the support route

Run this at your project root. The CLI auto-detects Next.js and drops three files in the right places.

```bash
npx @liraintelligence/support init --org-id=YOUR_ORG_ID
```

Replace `YOUR_ORG_ID` with your actual org ID from **Lira Settings → Organization**.

The CLI creates:

```
app/
  support/
    page.tsx                ← server component shell + metadata
    LiraSupport.client.tsx  ← client component that mounts the SDK
  api/
    lira/
      sign/
        route.ts            ← signs visitor emails server-side
.env.local                  ← LIRA_WIDGET_SECRET + NEXT_PUBLIC_LIRA_ORG_ID
```

---

## Step 2 — Install the package

```bash
npm install @liraintelligence/support
```

(or `pnpm add` / `yarn add` — works with any package manager).

---

## Step 3 — Fill in your widget secret

Open `.env.local` and replace the empty `LIRA_WIDGET_SECRET=` line with your secret from **Lira Settings → Support → API keys → Signing secret**.

```env
NEXT_PUBLIC_LIRA_ORG_ID=org-xxxxxxxxxxxx
LIRA_WIDGET_SECRET=lirask_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

:::warning Keep the secret server-side
`LIRA_WIDGET_SECRET` is read only by the server route at `app/api/lira/sign/route.ts`. **Never** prefix it with `NEXT_PUBLIC_` — that would expose it to the browser.
:::

---

## Step 4 — Run it

```bash
npm run dev
```

Open `http://localhost:3000/support`. You should see the Lira chat + tickets UI rendered full-page inside your Next.js layout.

---

## Wiring your real auth

The CLI scaffold uses a placeholder `useCurrentUser()` hook returning a demo user. Replace it with your real auth:

```tsx
// app/support/LiraSupport.client.tsx
'use client'

import { useEffect, useState } from 'react'
import { LiraProvider, LiraSupportPage, useLiraAction } from '@liraintelligence/support/react'
import { useSession } from 'next-auth/react'  // or your auth library

export function LiraSupport() {
  const { data: session } = useSession()
  const user = session?.user
  const [sig, setSig] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.email) return
    fetch('/api/lira/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    })
      .then((r) => r.json())
      .then(({ sig }) => setSig(sig))
  }, [user?.email])

  const identity = user?.email && sig ? { email: user.email, name: user.name, sig } : undefined

  return (
    <LiraProvider
      config={{
        orgId: process.env.NEXT_PUBLIC_LIRA_ORG_ID!,
        orgName: 'YourCompany',
        primaryColor: '#111827',
        greeting: 'Hi! How can we help?',
      }}
      identity={identity}
      context={{
        route: '/support',
        account: user ? { id: user.id, plan: user.plan } : undefined,
      }}
    >
      <LiraSupportPage style={{ minHeight: 720 }} />
    </LiraProvider>
  )
}
```

For the [identified-visitor flow](#identified-visitors) (HMAC signing) to work, your `/api/lira/sign` route should authenticate the request and only sign for the currently-signed-in user. The CLI scaffold accepts an email from the request body, which is fine for dev — for production, read the email from your server session instead.

---

## Identified visitors

When a visitor is signed in, Lira gets to know who they are (name, email, account context) without asking. Here's how the signing works:

```ts
// app/api/lira/sign/route.ts (already created by the CLI)
import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'  // your auth

export async function POST() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const email = session.user.email.trim().toLowerCase()
  const sig = crypto
    .createHmac('sha256', process.env.LIRA_WIDGET_SECRET!)
    .update(email)
    .digest('hex')
  return NextResponse.json({ sig })
}
```

The client passes `{ email, name, sig }` to `<LiraProvider identity={...}>`. Lira's backend verifies the HMAC before trusting the email.

---

## Add the floating widget to every page (optional)

If you want a chat bubble on pages besides `/support`, add this to your root layout:

```tsx
// app/layout.tsx
import { LiraProvider, LiraWidget } from '@liraintelligence/support/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <LiraProvider config={{ orgId: process.env.NEXT_PUBLIC_LIRA_ORG_ID! }}>
          {children}
          <LiraWidget />
        </LiraProvider>
      </body>
    </html>
  )
}
```

---

## Common pitfalls

**"window is not defined" error**
The widget runtime needs the browser. Make sure components that use `useLira`, `<LiraSupportPage />`, or `<LiraWidget />` are inside `'use client'` files.

**Widget never appears**
- Confirm `NEXT_PUBLIC_LIRA_ORG_ID` is set in `.env.local` (the `NEXT_PUBLIC_` prefix matters)
- Restart `npm run dev` after editing `.env.local`
- Check the browser console for errors loading `https://widget.liraintelligence.com/v1/widget.js`

**Identity not recognised**
- Check `/api/lira/sign` returns `{ sig: "..." }` not an error (try hitting it directly)
- Confirm `LIRA_WIDGET_SECRET` matches what's in **Lira Settings → Support → API keys → Signing secret** exactly
- Email is lowercased + trimmed on both signing and verification — make sure your client passes the same case

---

## Next: the floating widget

After you've got the standalone `/support` page working, [add the floating widget](/platform/customer-support/widget) to give users a chat bubble on every other page.
