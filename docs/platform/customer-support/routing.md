---
slug: /platform/customer-support/routing
sidebar_position: 14
title: Routing & assignment
description: How a ticket gets to the right queue, the right team, and the right person — using AI classification, queues, and teams.
---

# Routing & assignment

When a conversation becomes a ticket, Lira decides three things: which **queue** it belongs in, which **team** owns it, and which **person** works it.

## 1. Classification

Every ticket is classified by the AI before routing. Classification produces:

- **Category** — `billing_payments`, `account_access`, `technical_issue`, `sdk_integration`, `compliance_fraud`, `product_enquiry`, `complaint`, `other`
- **Priority** — `urgent`, `high`, `medium`, `low`
- **Security flags** — set when the conversation touches fraud, legal or privacy
- Language and product area

## 2. Queue selection

The category maps to a queue. Security flags override everything — a ticket with a security flag goes to the Security queue regardless of its category.

Every organization gets six queues by default:

| Queue | Handles |
| --- | --- |
| **Triage** | `other`, `complaint` — and anything the classifier was not confident about |
| **Billing** | `billing_payments` |
| **Account Access** | `account_access` |
| **Technical Support** | `technical_issue`, `sdk_integration` |
| **Security & Compliance** | `compliance_fraud` |
| **Product Questions** | `product_enquiry` |

You can rename queues, change which categories map to them, and add your own.

## 3. Team ownership

A ticket is also assigned to a **team**, defaulting to Support, based on the same AI category. The team's members are emailed so a human knows the ticket exists.

Team assignment only happens when the ticket has no team yet. That means a manual reassignment is never silently overwritten, and a re-route does not re-notify everyone.

## 4. Person assignment

Assignment to an individual is handled by a background worker using agent availability. Each agent has an availability record you manage in **Support → Teams**, and a ticket can always be reassigned by hand from the ticket view.

## SLA attachment

Routing also attaches the [SLA policy](/platform/customer-support/sla) — the most specific policy matching the ticket's priority, tier, category and queue.

## Audit

Every routing and assignment change is written to the ticket's event history with the actor (`system`, `agent`, `assistant`, `visitor` or `integration`) and a reason. **Support → Tickets → (ticket) → History** shows the full trail, and it is included in [audit export](/platform/customer-support/audit).

## Not supported yet

Stated plainly:

- **No rule builder for routing.** Category-to-queue mapping is configurable, but there is no if/then rule editor with arbitrary conditions, time delays or chained actions.
- **No skills-based or load-balanced assignment strategies** (round-robin, least-busy) — assignment uses availability, then manual reassignment.
- **No macros or canned replies.** Agents write replies, with the AI's draft as a starting point.
