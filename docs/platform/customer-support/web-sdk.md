---
sidebar_position: 3
title: Web SDK and Full-page Support Embed
description: Integrate Lira into your own web app route, with full-page support, signed identity, live context, tickets, and optional floating chat.
---

# Web SDK and Full-page Support Embed

The Web SDK is the recommended integration path for B2B products. Your company
owns the route, layout, navigation, and domain, while Lira provides the support
runtime: AI chat, tickets, escalation, Knowledge Base answers, signed identity,
live product context, and action execution.

For example, LemonPay should create its own route such as:

```txt
https://lemonpay.com/support
```

Inside that route, LemonPay mounts Lira. Customers never need to leave LemonPay's
product or visit a Lira-hosted URL.

---

## Recommended architecture

| Surface | Use it for | Who owns the page |
|--------|------------|-------------------|
| Full-page Support SDK | Main in-app support center, ticket history, long conversations | Your product |
| Floating widget | Quick support entry point on marketing pages or dashboards | Your product |
| Hosted portal | Temporary no-code fallback only | Lira |

For production customer apps, use the full-page SDK. The hosted portal is useful
when a team cannot ship product code yet, but it should not be the primary B2B
integration.

---

## Option 1: Script tag, no framework

Create a support route in your app, add a container, and load the Lira runtime:

```html
<div id="lira-support-root" style="height: 720px;"></div>

<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-mode="fullscreen"
  data-target="#lira-support-root"
  data-greeting="Hi! How can we help you?">
</script>
```

This renders the full support conversation inside `#lira-support-root`. There is
no floating launcher bubble in fullscreen mode.

---

## Fullscreen layouts

Fullscreen mode (`mountSupportPage`) supports two layouts:

| Layout            | What it renders                                                                                   |
|-------------------|---------------------------------------------------------------------------------------------------|
| `support_center` (default) | An **answer-first help page**: a describe-your-issue input at the top, then inline AI answers, knowledge-base source cards, suggestion buttons, browse-topics, popular articles, an account panel, and your tickets. Free-text chat is opt-in, and ticket escalation is the fallback. |
| `messenger`  | The Home/Chat conversational surface — the widget experience without a floating bubble. Opt in with `layout: 'messenger'`. |

Choose `support_center` when you want a real help-center page rather than a chat
panel. The visitor types their issue once; Lira answers in place with steps,
linked articles, and tappable next-step suggestions. If the visitor would rather
type, a chat composer appears inline; if Lira can't resolve it, it offers to
draft and file a ticket — and human follow-up happens in your Tickets section,
never on the page itself.

**Script tag:**

```html
<div id="lira-support-root" style="min-height: 720px;"></div>

<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-mode="fullscreen"
  data-layout="support_center"
  data-target="#lira-support-root">
</script>
```

**JavaScript SDK:**

```js
window.Lira.mountSupportPage('#lira-support-root', { layout: 'support_center' })
```

**React:**

```tsx
<LiraSupportPage config={{ layout: 'support_center' }} />
```

Fullscreen embeds render the `support_center` layout by default. To keep the
legacy Home/Chat surface, pass `layout: 'messenger'` explicitly.

---

## Option 2: JavaScript SDK API

Use the SDK API when you need to identify logged-in users and provide account
context.

```html
<div id="lira-support-root" style="height: 720px;"></div>
<script src="https://widget.liraintelligence.com/v1/widget.js"></script>
<script>
  window.Lira.init({
    orgId: 'YOUR_ORG_ID',
    orgName: 'LemonPay',
    primaryColor: '#111827',
    greeting: 'Hi! How can we help you?'
  })

  window.Lira.identify({
    email: currentUser.email,
    name: currentUser.name,
    sig: serverGeneratedHmac
  })

  window.Lira.setContext({
    route: window.location.pathname,
    account: {
      id: currentUser.accountId,
      plan: currentUser.plan,
      status: currentUser.subscriptionStatus
    }
  })

  window.Lira.mountSupportPage('#lira-support-root')
</script>
```

The CDN runtime exposes:

```ts
window.Lira.init(config)
window.Lira.identify(visitor)
window.Lira.logout()
window.Lira.setContext(context)
window.Lira.track(eventName, payload)
window.Lira.registerAction(name, handler)
window.Lira.unregisterAction(name)
window.Lira.mountWidget(options)
window.Lira.mountSupportPage(target, options)
window.Lira.destroy()
```

---

## Option 3: NPM package

Use the NPM package when your app is bundled with React, Next.js, Vue, Remix, or
another modern frontend toolchain. The package is published on npm as
`@liraintelligence/support`, so it installs out of the box.

```bash
npm install @liraintelligence/support
```

Framework-agnostic usage:

```ts
import { init, identify, setContext, mountSupportPage, registerAction } from '@liraintelligence/support'

await init({ orgId: 'YOUR_ORG_ID', orgName: 'LemonPay' })
await identify({
  email: currentUser.email,
  name: currentUser.name,
  sig: serverGeneratedHmac
})
await setContext({
  route: window.location.pathname,
  account: {
    id: currentUser.accountId,
    plan: currentUser.plan,
    status: currentUser.subscriptionStatus
  }
})

registerAction('billing.open_checkout', async ({ payload }) => {
  await openCheckout(payload)
  return { ok: true, message: 'Checkout opened' }
})

await mountSupportPage('#lira-support-root')
```

React usage:

```tsx
import { LiraProvider, LiraSupportPage, useLiraAction } from '@liraintelligence/support/react'

function BillingActions() {
  useLiraAction('billing.open_checkout', async ({ payload }) => {
    await openCheckout(payload)
    return { ok: true, message: 'Checkout opened' }
  })
  return null
}

export function SupportRoute() {
  return (
    <LiraProvider
      config={{ orgId: 'YOUR_ORG_ID', orgName: 'LemonPay' }}
      identity={{ email: currentUser.email, name: currentUser.name, sig: serverGeneratedHmac }}
      context={{ route: window.location.pathname, account: currentUser.account }}
    >
      <BillingActions />
      <LiraSupportPage style={{ minHeight: 720 }} />
    </LiraProvider>
  )
}
```

Package exports:

| Import | Use |
|--------|-----|
| `@liraintelligence/support` | Headless client, identity, context, mounting, action registration |
| `@liraintelligence/support/react` | `LiraProvider`, `useLira`, `useLiraAction`, `LiraSupportPage`, `LiraWidget` |

---

## Customer actions

Customer actions let your product safely handle app-specific work when Lira asks
the page to do something, such as opening checkout, pre-filling an onboarding
field, or starting a customer-owned workflow.

```ts
registerAction('account.refresh_billing_status', async ({ payload }) => {
  const status = await refreshBillingStatus(payload.accountId)
  return {
    ok: true,
    message: 'Billing status refreshed',
    data: { status }
  }
})
```

Use namespaced action names:

- `billing.open_checkout`
- `account.refresh_billing_status`
- `onboarding.prefill_domain`
- `support.create_internal_ticket`

The SDK emits a `lira:action_result` browser event after an action succeeds or
fails. Backend-visible action-result ingestion is planned as the next action
layer upgrade; the current SDK gives the customer a typed registration API while
preserving the existing safe host-page bridge.

---

## Signed identity

If your product has logged-in users, sign each visitor server-side. This lets
Lira know the user is real and prevents someone from spoofing another customer's
email.

1. Store your Lira widget secret on your backend only.
2. Compute `HMAC-SHA256(LIRA_WIDGET_SECRET, user.email)`.
3. Pass the user email, name, and signature to `window.Lira.identify(...)`.

Example Node.js signing endpoint:

```ts
import crypto from 'node:crypto'

export function signLiraVisitor(email: string) {
  return crypto
    .createHmac('sha256', process.env.LIRA_WIDGET_SECRET!)
    .update(email.trim().toLowerCase())
    .digest('hex')
}
```

Never expose the widget secret in browser code.

---

## Logout & identity transitions

Tell the SDK when a user logs out. This is the missing piece most teams forget, and it's what stops one user's chat from leaking to the next person on a shared device.

```ts
// In your logout handler, after you've cleared your own session:
window.Lira?.logout()
// or, if you imported the package:
//   import { logout } from '@liraintelligence/support'
//   await logout()
```

`logout()` is equivalent to `identify({ email: null, name: null, sig: null })` — either form works. Both:

- wipe the current user's chat history off this device,
- rotate the anonymous chat scope so the next anonymous visitor starts clean,
- close any active WebSocket session and reconnect anonymously.

### What the SDK does automatically across identity transitions

The SDK scopes everything (localStorage, WebSocket session, suggestion chips) to identity. You don't need to manage this — just call `identify(...)` on login and `logout()` on logout, and the rest takes care of itself:

| When | What the SDK does |
|---|---|
| Anonymous visitor → `identify(...)` (login) | Drops the anonymous cache, switches to the identified storage key, **calls the server to hydrate this user's recent conversation** (so chat history follows them across devices). |
| User A → `identify(B)` (switch on same browser) | A's local cache wiped. B's cache (or server-fetched history) loaded. A's session is fully scrubbed. |
| Identified user → `logout()` | Identified cache wiped. Anonymous scope rotated. Next visitor on this browser sees nothing of the previous user's chat. |
| `identify(...)` with the same email again | No-op (safe to call on every page load). |

### Cross-device history

When an identified visitor opens the widget on a new device (different browser, mobile, etc.), the SDK calls `GET /lira/v1/support/chat/history/<orgId>?email=…&sig=…` on `identify()`. Lira validates the signature against your widget secret and returns the user's most recent conversation, which the widget hydrates into its UI. No extra wiring on your side — as long as you sign each user's email correctly, their history follows them.

---

## Live product context

Use `setContext` whenever important product state changes. This is how Lira can
answer account-specific questions and guide users based on what is happening in
your app.

Good context includes:

- Current route and page name
- Account ID, plan, subscription status, and billing state
- Feature flags or enabled modules
- Recent errors or failed actions
- Current onboarding step
- Safe summaries of relevant records, not private raw data

Example:

```js
window.Lira.setContext({
  route: '/billing',
  account: {
    id: 'acct_123',
    plan: 'Growth',
    nextInvoiceDate: '2026-06-01',
    paymentMethod: 'Visa ending 4242'
  },
  ui: {
    page: 'Billing settings',
    lastError: null
  }
})
```

Call it again after route changes, plan changes, billing events, or onboarding
progress changes.

---

## Floating widget on other pages

You can use the same runtime as a floating support launcher:

```html
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-position="bottom-right"
  data-greeting="Hi! How can we help you?">
</script>
```

Most teams use both:

- `/support` route: full-page SDK
- Dashboard or marketing pages: optional floating widget

---

## LemonPay integration checklist

1. Create `lemonpay.com/support` inside the LemonPay app.
2. Add `<div id="lira-support-root"></div>` to that route.
3. Either load `https://widget.liraintelligence.com/v1/widget.js` or install
   `@liraintelligence/support`.
4. Call `window.Lira.init({ orgId: '...' })` or `await init({ orgId: '...' })`.
5. Generate visitor signatures on LemonPay's backend (HMAC of the user's email with the widget secret).
6. Call `window.Lira.identify({ email, name, sig })` after login state is known.
7. Call `window.Lira.setContext(...)` with account and route context.
8. **Call `window.Lira.logout()` on the logout handler** so the next user on a shared device doesn't see the previous user's chat.
9. Call `window.Lira.mountSupportPage('#lira-support-root')`.
10. Test account-aware Q&A, Knowledge Base answers, action cards, ticket creation,
    and escalation.

---

## Where to find install values

In the Lira dashboard:

- **Support → Activate** shows the SDK snippet after activation.
- **Settings → Support → Get connected** shows full-page SDK, JavaScript API, and
  floating widget snippets.
- **Settings → Support → Get connected → Widget secret** shows the server-side
  widget secret for signed visitors.
