---
sidebar_position: 4
title: Tickets
description: "Lira's ticketing system: AI-assisted triage, async human ownership, customer-visible threads, SLAs, CSAT, and integration outbox events."
---

# Tickets

Tickets are how Lira turns a support conversation into an accountable support
case. Lira keeps answering what it can, but when an issue needs ownership,
follow-up, attachments, SLA tracking, or a human decision, it creates a ticket
with the right summary, category, queue, priority, and customer-visible thread.

Tickets are not a replacement for chat history. Chat history is the full
conversation record. Tickets are the work items your team operates.

---

## How tickets are created

Tickets can be created in three ways:

| Source | When it happens | Result |
|---|---|---|
| Lira chat | Lira needs async follow-up or human ownership | Lira creates a ticket with conversation context and keeps helping where it can |
| Manual operator action | A teammate creates a ticket in Support -> Tickets | The ticket enters the same routing, SLA, notification, and analytics flow |
| Customer ticket page | A verified customer replies or follows up | The existing ticket thread updates and can reopen when appropriate |

Lira should not create ticket noise for questions it can answer confidently from
the knowledge base or live customer context. Tickets are for issues that need
accountability.

---

## Lifecycle

```txt
Customer asks for help
  -> Lira answers from knowledge/context when possible
  -> If follow-up is needed, Lira creates a ticket
  -> Ticket is classified and routed into a queue
  -> SLA timers and notifications start
  -> Agent replies, adds notes, escalates, or resolves
  -> Customer can reply from the secure ticket link
  -> Resolved tickets collect CSAT and feed learning loops
```

Customer replies reopen `pending` tickets automatically. Resolved tickets reopen
only inside the configured reopen window. Closed, merged, and snoozed tickets do
not reopen automatically.

---

## Statuses

| Status | Meaning |
|---|---|
| `new` | Created and waiting for first triage or first response |
| `open` | Active and waiting on the support team |
| `in_progress` | A teammate is working the issue |
| `pending` | Waiting on the customer; SLA can pause or change based on policy |
| `on_hold` | Waiting on an internal team, vendor, or system dependency |
| `escalated` | Moved to a higher tier, specialist, queue, or named owner |
| `resolved` | Marked solved, still eligible for customer reopen during the reopen window |
| `closed` | Final archive state |
| `merged` | Duplicate or related case merged into another ticket |
| `snoozed` | Hidden until a future time, then returns to the active queue |

The frontend should treat `new`, `open`, `in_progress`, and `escalated` as
active work. `pending`, `on_hold`, and `snoozed` are waiting states. `resolved`,
`closed`, and `merged` are completion states.

---

## Classification and routing

Every ticket can carry structured classification:

- Category and subcategory
- Product area
- Language
- Priority and priority reason
- Confidence score
- Dedupe key
- Handoff brief

The classifier is used for routing, reporting, and better agent context. An
operator can still override category, priority, queue, or assignee.

Queues and SLA policies are configured per organization. Routing can send a
ticket to the default queue, a category-specific queue, a specialist queue, or a
manual assignee.

---

## Operator workspace

Go to **Support -> Tickets**.

Operators can:

- List and filter tickets by status, category, queue, assignee, and priority.
- Open a ticket detail view with public messages, internal notes, metadata, and
  event timeline.
- Reply to the customer. Replies are sent by email and stored on the public
  ticket thread.
- Add internal notes that never appear to the customer.
- Change status, priority, category, queue, or assignee.
- Escalate and acknowledge escalation.
- Resolve, reopen, close, mark pending, or put a ticket on hold.
- Upload attachments.
- Regenerate the handoff brief.
- Request CSAT.

Internal notes and internal events are operator-only. Customer-facing APIs strip
operator identifiers, internal notes, queue details, handoff internals, and SLA
breach metadata.

---

## Customer ticket access

Customer ticket access uses secure magic-link tokens or verified SDK identity.
Do not build new customer UI on raw email lookup.

### Magic-link access

Use this for unauthenticated customer ticket pages:

```http
POST /lira/v1/support/tickets/public/:orgId/tickets/access-link
```

Body:

```json
{
  "email": "customer@example.com",
  "ticket_number": "LIRA-A1B2"
}
```

`ticket_number` is optional. If provided, the link is scoped to one ticket.

The response is always generic:

```json
{ "ok": true }
```

This prevents account enumeration. The UI should say: "If this email has
tickets, we sent a secure access link."

### Token-scoped customer routes

```http
GET  /lira/v1/support/tickets/public/:orgId/tickets?access_token=...
GET  /lira/v1/support/tickets/public/:orgId/tickets/:ticketNumber?access_token=...
POST /lira/v1/support/tickets/public/:orgId/tickets/:ticketNumber/reply?access_token=...
POST /lira/v1/support/tickets/public/:orgId/tickets/:ticketNumber/attachments?access_token=...
POST /lira/v1/support/tickets/public/:orgId/tickets/:ticketNumber/csat?access_token=...
```

Tokens are signed, time-bounded, and scoped by organization, email, and
optionally ticket number.

### Verified SDK access

Use verified SDK access when the support surface is embedded inside a logged-in
customer app.

```http
GET  /lira/v1/support/tickets/verified/:orgId/tickets?email=...&sig=...
GET  /lira/v1/support/tickets/verified/:orgId/tickets/:ticketNumber?email=...&sig=...
POST /lira/v1/support/tickets/verified/:orgId/tickets/:ticketNumber/reply?email=...&sig=...
```

`sig` is an HMAC-SHA256 signature generated by the customer backend using the
organization's widget secret. Never compute this signature in browser code.

Example:

```ts
import crypto from 'node:crypto'

export function signLiraVisitor(email: string) {
  return crypto
    .createHmac('sha256', process.env.LIRA_WIDGET_SECRET!)
    .update(email.trim().toLowerCase())
    .digest('hex')
}
```

---

## Deprecated legacy routes

These routes are deprecated:

```http
GET  /lira/v1/support/tickets/visitor/:orgId/:email
GET  /lira/v1/support/tickets/by-number/:ticketNumber?org_id=...
POST /lira/v1/support/tickets/by-number/:ticketNumber/reply
POST /lira/v1/support/tickets/by-number/:ticketNumber/attachments
```

In production, they are blocked by default with `410 Gone` unless
`LIRA_ALLOW_LEGACY_PUBLIC_TICKET_ACCESS=true` is intentionally enabled for a
temporary migration window. New deployments must use magic-link access or
verified SDK identity.

---

## Notifications, CSAT, and learning

Lifecycle emails are automatic:

- New ticket confirmation
- Agent replies
- Pending customer reminder
- Escalation notification
- Resolved notification
- Reopened notification
- CSAT request

Negative CSAT can create an internal recovery note. Resolved tickets with
knowledge gaps can feed the knowledge-draft review loop so the team can improve
future Lira answers.

---

## Analytics and audit

Ticket analytics include:

- Backlog overview
- SLA hit rate, at-risk, and breached counts
- Average first-response and resolution time
- Category volume and reopen rate
- Per-agent workload
- AI-to-ticket conversion rate
- CSAT average and negative CSAT count

Audit export supports JSON and CSV for ticket-level review.

---

## Smoke testing

The backend repo includes:

```bash
scripts/smoke-test-ticketing.sh
```

For local or staging API runs, set:

```bash
LIRA_DEBUG_TICKET_ACCESS_TOKEN=true
```

That lets the smoke test verify successful public list/detail/reply paths
without opening the test inbox. The API ignores this debug token echo in
production.
