---
sidebar_position: 6
title: Agent Runtime
description: How Lira decides what an AI agent can read, what it can do, when it needs human approval, and where every action is recorded.
---

# Agent Runtime

The **agent runtime** is the set of rules Lira applies every time the AI tries to read product data or perform an action on a customer's behalf. It exists for one reason: as Lira becomes more autonomous, you need a single, predictable answer to the question *"is this safe to run, and who is allowed to ask?"*.

This page is the top-level guide. The runtime has three concrete surfaces:

- [**Capabilities**](/platform/customer-support/capabilities) — the catalog of things Lira can read or do for your org, with risk and identity policy attached to each one.
- **Policy engine** — the central decision step that runs before every tool call.
- [**Audit**](/platform/customer-support/audit) — the persistent record of every action Lira asked to run, what the engine decided, and what the redacted inputs and outputs were.

---

## What an "agent capability" is

A **capability** is anything the AI is allowed to invoke during a conversation. There are two kinds:

| Kind | What it is | Examples |
|---|---|---|
| **Resource** | A read. The agent fetches structured data and may show it to the customer. | Customer profile, subscription state, current ticket, integration health. |
| **Action** | A write. The agent performs an operation in your product or a connected system. | Open a support ticket, cancel a subscription, retry a failed payment, mark an onboarding step complete. |

Every capability ships with two pieces of policy metadata:

- A **risk tier** — how dangerous the call is.
- An **auth scope** — the minimum identity level the visitor must have for the call to be considered.

Capabilities come from three sources today:

1. **Built-in** — escalation, ticket creation, integration health, onboarding steps, knowledge-base search. Ship with Lira and need no setup.
2. **Pack** — Stripe, Nimbus, and other first-party packs gated by your plan and connected integrations.
3. **Server-side** — capabilities you register against your backend through the admin API. Useful for trusted operations you don't want to expose in browser code.

Browser-side `Lira.registerResource(...)` and a richer `Lira.registerAction(...)` are on the roadmap but not yet shipped on `@liraintelligence/support`. Today the SDK's `registerAction(name, handler)` form still works and registers actions with conservative defaults.

---

## Risk tiers

Risk tier is the single most important field on a capability. The engine reads it on every call and uses it to decide whether the agent may proceed alone, must ask the customer, must wait for a teammate, or is blocked outright.

| Tier | What it means | Typical behavior |
|---|---|---|
| `read_public` | Public knowledge or page state. No PII. | Auto-execute for anyone. |
| `read_private` | Private to the customer (account email, plan, ticket they own). | Auto-execute for verified customers. Blocked for anonymous visitors. |
| `safe_write` | Reversible, low-stakes write (mark an onboarding step done, create a low-risk ticket). | Auto-execute for verified customers. |
| `customer_confirm` | Material to the customer (cancel subscription, change plan). | Surfaces a confirmation card; the customer must agree in chat. |
| `step_up` | Requires fresh proof of identity (e.g. account changes after long idle). | Currently blocked end-to-end while step-up auth lands. Agent escalates to a human instead. |
| `admin_approve` | Requires a human teammate to approve before the action runs. | Run pauses as pending approval — see [Actions](/platform/customer-support/actions) for the review flow. |
| `human_only` | The AI is never permitted to perform this. | Agent escalates without offering it as an option. |

Tiers are strictly ordered: anything more sensitive than the prior row inherits all of its restrictions.

---

## Auth scopes

A capability's `auth_scope` says what the *visitor* must look like for the agent to even consider running it:

| Scope | Visitor state |
|---|---|
| `public` | Anonymous landing-page visitor. No signed identity. |
| `verified_visitor` | The Web SDK passed a signed identity, but the address is unverified. |
| `verified_customer` | Signed identity *and* the email belongs to a real customer in your account system. |

Public visitors can never reach a `verified_customer`-scoped capability. The policy engine refuses before the model gets a chance to retry with different arguments.

---

## How the policy engine decides

When the AI asks to call a capability, the engine runs this check before any code executes:

```
incoming tool call
  ↓
policy_engine.evaluate(capability, runtimeContext)
  ↓
{ allowed, mode, risk, requiredScope, effectiveScope, reason }
  ↓
  • allowed=true,  mode=execute   →  run the tool now
  • allowed=true,  mode=confirm   →  ask the customer for approval in-chat
  • allowed=true,  mode=human     →  queue for a teammate (pending approval)
  • allowed=false                 →  block, never call the tool
```

The runtime context is built from the authenticated session — it carries the `orgId`, `conversationId`, visitor identity, and current auth scope. The model never gets to declare which org it is acting for; that field is rejected if it appears in the tool arguments. **Cross-tenant calls are impossible by construction**, not by convention.

The decision, the inputs, and the outputs all get persisted to the audit trail described below.

---

## Audit

Every capability call — successful, blocked, confirmed, rejected, failed — becomes an **AgentActionRun** record. The record captures:

- The capability name and kind (`resource` or `action`).
- The risk tier, the required and effective auth scopes, and the policy decision.
- A redacted summary of the input and output. Emails are masked. Fields with secret-sounding names are stripped at any depth.
- The conversation, visitor, and (if applicable) ticket IDs that triggered the call.
- An estimate of the model tokens used and the resulting dollar cost.
- The run status: `requested`, `blocked`, `pending_approval`, `approved`, `running`, `succeeded`, `failed`, `cancelled`.

Admins read this in **Settings → Support → Health & audit → Agent audit log**. See the [Audit guide](/platform/customer-support/audit) for the dashboard surface and the API.

---

## Admin overrides

Org admins can override a capability's metadata in **Settings → Support → AI behavior → Capabilities**. The engine enforces one invariant: **overrides may only tighten policy, never loosen it**.

If a built-in is `read_private` / `verified_visitor`, an admin may override it to `safe_write` / `verified_customer`, but a write that tries to drop it to `read_public` / `public` is refused with a `RISK_LOOSENED` or `SCOPE_LOOSENED` error. This holds at two layers:

- The admin API rejects the loosening write.
- The runtime registry independently clamps any stored override that somehow points the wrong way.

This is deliberate defense-in-depth: a single misconfigured admin row should never silently expand what an anonymous visitor can reach.

---

## Where to go next

- [**Capabilities reference**](/platform/customer-support/capabilities) — manage the catalog, register server-side capabilities, override built-in policy.
- [**Audit reference**](/platform/customer-support/audit) — read the audit log, filter and paginate, integrate with the admin API.
- [**Actions**](/platform/customer-support/actions) — how to review and approve the runs the engine routed to a human.
- [**Concepts**](/getting-started/concepts) — the same vocabulary, framed for newcomers.
