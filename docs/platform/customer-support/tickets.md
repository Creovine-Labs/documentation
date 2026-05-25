---
sidebar_position: 4
title: Tickets
description: How Lira's ticketing system works — async human follow-up that runs in parallel to live AI chat.
---

# Tickets

Tickets are how Lira hands a question to your team **without breaking the conversation with the customer**.

When Lira can't confidently answer something on its own — a billing edge case, a feature request, anything outside the Knowledge Base — it opens a ticket. The visitor gets an email confirmation; your team gets notified at your **Ticketing Email**; and Lira keeps chatting with the visitor about anything else they want to discuss. No silent hand-off, no live-chat takeover, no awkward "a human will be with you shortly".

---

## How tickets differ from chat history

| | **Chat history** (was "Inbox") | **Tickets** |
|---|---|---|
| What it is | The raw AI ↔ visitor chat log | A discrete async task for your team |
| State | open / pending / resolved | open / in_progress / resolved / closed |
| Volume | Every chat — mostly resolved by Lira silently | Only when Lira can't answer — small queue |
| Reader | QA / audit ("was the AI accurate?") | Operators actually work these |
| Lifetime | Closes when the visitor stops talking | Stays open until a teammate resolves it |

**Tickets are the primary surface for your support team.** Chat history is the audit log behind it.

---

## Lifecycle

```
Visitor asks Lira something it can't answer
  → Lira calls lira_create_support_ticket (with visitor's approval)
  → Backend creates ticket LIRA-XXXX with subject + summary + visitor email
  → Visitor receives confirmation email + sees the ticket at /tickets
  → Team gets notified at your Ticketing Email (+ CC list on Enterprise)
  → Team opens it in Support → Tickets, types a reply
  → Visitor gets an email + sees the reply at /tickets/LIRA-XXXX
  → When done, team clicks "Mark resolved"
```

Lira's live chat keeps running in parallel the whole time.

---

## The ticket number

Every ticket gets a short human-readable identifier:

```
LIRA-A1B2
```

Four characters, dropped-look-alike alphabet (no `0/O/1/I/L`). Easy to read over the phone or copy-paste into Slack. The visitor sees this in their email and on their portal; your team sees it in the operator inbox.

---

## Ticket statuses

| Status | What it means |
|--------|---------------|
| **Open** | Just opened. Nobody on the team has replied yet. |
| **In progress** | A teammate replied — moves out of the unread queue. |
| **Resolved** | Closed by a teammate. Visitor can't reply unless reopened. |
| **Closed** | Archived (rarely set manually). |

The transition from **open → in_progress** is automatic the first time an agent posts a reply.

---

## Operator: working tickets

Navigate to **Support → Tickets**.

**The list view** shows every ticket for the org, sorted active-first. Click the status tabs to filter. Each row shows the ticket number, subject, visitor, source (`lira_onboarding` / `customer_widget` / `email`), and a one-line summary preview.

**The detail view** shows the full thread (visitor on the left, agent on the right) plus:

- Ticket metadata (visitor email, source, opened-at)
- Reply textarea — typing here sends an email to the visitor automatically
- "Mark resolved" button

**To reply:** open the ticket, type, click **Send reply**. The visitor gets an email with your message and a link back to the thread.

**To resolve:** click the **Mark resolved** button at the top. The visitor sees the ticket close and gets a polite "this ticket is resolved" notice.

---

## Visitor: their tickets

Each visitor sees only their own tickets at:

```
https://liraintelligence.com/tickets               # list
https://liraintelligence.com/tickets/LIRA-A1B2     # single ticket
```

Identity is keyed by email — there's no separate login. The visitor's email is captured during the conversation that created the ticket. When they visit `/tickets`, the page reads their auth email and filters to tickets they opened.

The visitor can reply to any unresolved ticket from this page. Their reply lands as a `visitor` message on the thread and the next teammate to look at the ticket sees it.

---

## Ticketing Email

Set during activation Step 3 (or in **Settings → Support → Ticketing**). Every new ticket triggers an email to this address with the subject `Ticket LIRA-XXXX: {subject}` and the visitor's original message.

### Additional recipients (Enterprise)

Enterprise plans can CC up to two more teammates on every ticket notification. Configure them in the same Step 3 / Settings → Ticketing tab.

---

## Where tickets fit relative to the old "Escalation" flow

Previous versions of Lira had an `escalate_to_human` move that handed the live chat to a human and silenced the AI. That flow has been deprecated.

- `escalate_to_human` still exists as a tool but the agent is instructed never to call it in the onboarding flow — it calls `lira_create_support_ticket` instead.
- For customer-facing widgets, the same shift is rolling out: tickets replace silent live-chat hand-offs.
- The existing `escalation_email` config field is reused as the **Ticketing Email** — no migration needed.

---

## API surface

Operator-only (JWT + org membership):

- `GET  /lira/v1/support/tickets/orgs/:orgId` — list
- `GET  /lira/v1/support/tickets/orgs/:orgId/:ticketId` — detail + messages
- `POST /lira/v1/support/tickets/orgs/:orgId/:ticketId/reply` — agent reply (fires visitor email)
- `POST /lira/v1/support/tickets/orgs/:orgId/:ticketId/resolve` — mark resolved

Visitor-facing (no JWT; identity by email):

- `GET  /lira/v1/support/tickets/visitor/:orgId/:email` — list my tickets
- `GET  /lira/v1/support/tickets/by-number/:ticketNumber?org_id=...` — fetch by number + thread
- `POST /lira/v1/support/tickets/by-number/:ticketNumber/reply` — visitor reply (verifies `visitor_email` matches)
