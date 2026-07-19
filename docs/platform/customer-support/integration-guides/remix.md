---
sidebar_position: 4
title: Remix integration guide
description: Add Lira support to a Remix app in ~10 minutes.
---

# Remix integration guide

This guide adds support at `yourapp.com/support` in a Remix app.

**Time:** ~10 minutes.

---

## Step 1 — Install the package

```bash
npm install @liraintelligence/support
```

---

## Step 2 — Create the support route

Create `app/routes/support.tsx`:

```tsx
import { LiraProvider, LiraSupportPage } from '@liraintelligence/support/react'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import crypto from 'node:crypto'
import { getUserFromSession } from '~/auth.server'  // your auth helper

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromSession(request)
  let identity = null
  if (user?.email) {
    const sig = crypto
      .createHmac('sha256', process.env.LIRA_WIDGET_SECRET!)
      .update(user.email.trim().toLowerCase())
      .digest('hex')
    identity = { email: user.email, name: user.name, sig }
  }
  return json({ identity, orgId: process.env.LIRA_ORG_ID })
}

export default function Support() {
  const { identity, orgId } = useLoaderData<typeof loader>()
  return (
    <LiraProvider
      config={{ orgId: orgId!, orgName: 'YourCompany', greeting: 'Hi! How can we help?' }}
      identity={identity ?? undefined}
    >
      <LiraSupportPage style={{ minHeight: 720 }} />
    </LiraProvider>
  )
}
```

Remix lets you sign on the server in the loader, so identity arrives already-signed in your client component. No separate `/api/lira/sign` endpoint needed.

---

## Step 3 — Set environment variables

Add to `.env`:

```env
LIRA_ORG_ID=org-xxxxxxxxxxxx
LIRA_WIDGET_SECRET=lirask_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 4 — Run it

```bash
npm run dev
```

Visit `http://localhost:3000/support`.

---

## Common pitfalls

**"window is not defined" during SSR**
Wrap the `LiraSupportPage` in a `<ClientOnly>` if you hit hydration issues:

```tsx
import { ClientOnly } from 'remix-utils/client-only'

<ClientOnly fallback={<div>Loading…</div>}>
  {() => <LiraSupportPage style={{ minHeight: 720 }} />}
</ClientOnly>
```

**Identity not signed**
Confirm the loader is computing `sig` for logged-in users only — the demo handler above checks `user?.email` first.

---

## Next steps

- [Add the floating widget](/platform/customer-support/widget)
- [SDK API reference](/platform/customer-support/web-sdk)
