---
sidebar_position: 2
title: SDKs roadmap
description: Status of Lira's customer-facing SDKs — what ships today, what's planned, what's on hold.
---

# SDKs roadmap

Lira ships installable SDKs so customers can integrate the support runtime
natively into their own apps — their domain, their UI shell, their navigation.
The page below is the source of truth for what's available today versus on
the roadmap.

| SDK | Status | Install |
|-----|--------|---------|
| [**Web SDK** — `@liraintelligence/support`](/platform/customer-support/web-sdk) | **Available** | `npm install @liraintelligence/support` |
| **React Native SDK** (drop-in package) | Planned — Q2 2026 | — |
| **Standalone Runtime** (`setContext` + `registerAction`) | Will extract once a second Lira product consumes it | — |

:::warning Doing native mobile? You are NOT blocked — read this
"No React Native SDK yet" does **not** mean no mobile support. **Native mobile
(iOS, Android, Flutter, React Native) is fully supported today** — you build your
own chat screen on Lira's chat WebSocket with a session token minted by your
backend. The **[Native mobile guide](/platform/customer-support/mobile-frontend)**
is the complete spec.

The table above only tracks *drop-in packages*. Not sure which path is yours?
Start at **[Integrate Lira](/platform/customer-support/integrate)**.
:::

---

## Web SDK — Available today

The Web SDK powers the full-page support embed, the floating chat widget, the
identity / context / customer-action layer, and the live AI conversation
runtime. It's published on npm and ready for production use.

```bash
npm install @liraintelligence/support
```

```bash
npx @liraintelligence/support init   # scaffolds a starter file
```

See the [Web SDK guide](/platform/customer-support/web-sdk) for the complete API,
React adapter, identified-visitor signing, and customer-action examples.

---

## React Native SDK — Planned

A React Native package will let customers embed the Lira support runtime
inside their iOS and Android apps with the same identity, context, and
customer-action APIs as the Web SDK. One codebase, both stores.

**Status:** in design. **Expected:** Q2 2026.

**Why React Native first** (vs native Swift / Kotlin): one codebase covers
both stores with a single integration path. Most of Lira's B2B customers
already ship RN or Flutter apps. Native iOS/Android SDKs are not currently
on the roadmap; we'll add them only if RN coverage proves insufficient.

**What it will look like** (provisional API, subject to change):

```tsx
import { LiraProvider, LiraSupportScreen } from '@liraintelligence/react-native'

export function SupportScreen() {
  return (
    <LiraProvider config={{ orgId: 'org-xxxx', orgName: 'LemonPay' }}>
      <LiraSupportScreen />
    </LiraProvider>
  )
}
```

If you need mobile support before then, the fastest path today is to point a
"Help" link in your mobile app to your hosted Lira Web SDK at
`yourapp.com/support` (opens in the in-app browser). Covers ~100% of mobile
users with zero SDK work.

---

## Standalone Runtime — Will extract on demand

The `setContext` and `registerAction` primitives currently live inside
`@liraintelligence/support`. They power the AI's awareness of what's
happening in the customer's app and let the customer register custom
actions Lira can trigger.

We will extract them into a standalone `@liraintelligence/runtime` package
when a second Lira product (sales, meetings, future Lira surfaces) needs
the same primitives. Extracting too early would lock in an API surface
we'd want to evolve based on real production learnings from the Web SDK.

For now: use `setContext` and `registerAction` directly from
`@liraintelligence/support`. The migration path to `/runtime` will be a
re-export — no breaking change for existing consumers.

---

## Versioning

All Lira SDKs follow [SemVer](https://semver.org/):

- `0.x.y` — pre-1.0, expect occasional minor API changes. Pin to `~0.1.0`
  during early adoption if you want only patch updates.
- `1.0.0` — stable. Breaking changes will be reserved for major bumps with
  long deprecation windows.

The current Web SDK is `0.1.0`; we'll graduate to `1.0.0` once API surface
has stabilised against real customer deployments (target: Q2 2026).
