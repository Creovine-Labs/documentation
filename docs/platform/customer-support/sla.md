---
slug: /platform/customer-support/sla
sidebar_position: 13
title: SLA policies
description: First-response, next-response and resolution targets per priority, tier, category and queue — with at-risk and breach tracking.
---

# SLA policies

An SLA policy sets how fast a ticket must be answered and resolved. Lira attaches one to every ticket at routing time, tracks the clock, and flags the ticket as **at risk** before it breaches rather than after.

## What a policy contains

| Field | Meaning |
| --- | --- |
| `name` | Human label shown in the dashboard. |
| `priority` | Which ticket priority this policy applies to — `urgent`, `high`, `medium`, `low`. |
| `customer_tier` | Optional. Scope the policy to one customer tier. |
| `category` | Optional. Scope the policy to one ticket category. |
| `queue_id` | Optional. Scope the policy to one queue. |
| `business_hours_mode` | `24_7` or `business_hours`. |
| `first_response_minutes` | Deadline for the first human reply. |
| `next_response_minutes` | Deadline for each subsequent reply once the customer responds. |
| `resolution_minutes` | Deadline for the ticket to reach a resolved state. |
| `escalation_ack_minutes` | Deadline to acknowledge an escalated ticket. |
| `pending_pauses_sla` | Whether the clock pauses while the ticket is `pending` on the customer. |
| `on_hold_pauses_sla` | Whether the clock pauses while the ticket is `on_hold`. |

## Defaults

Every organization gets four policies on first use, one per priority. You can edit them or add narrower ones.

| Policy | First response | Next response | Resolution | Escalation ack |
| --- | --- | --- | --- | --- |
| Urgent default | 15 min | 30 min | 4 h | 5 min |
| High default | 1 h | 2 h | 8 h | 15 min |
| Medium default | 4 h | 8 h | 24 h | 1 h |
| Low default | 24 h | 24 h | — | — |

## How a policy is chosen

At routing time Lira picks the **most specific** policy that matches the ticket. A policy scoped to a queue, tier or category wins over a bare priority default. If nothing narrower matches, the priority default applies.

## At risk vs breached

Each ticket carries first-response, next-response and resolution deadlines. A background worker moves the ticket through:

- **ok** — inside the deadline
- **at_risk** — approaching the deadline, with a pre-breach notification to the assignee and team
- **breached** — past the deadline

Because the pre-breach notification fires before the deadline, an SLA miss is something your team gets warned about, not something they discover in a report.

## Pausing the clock

If `pending_pauses_sla` is on, the clock stops while you are waiting on the customer and resumes when they reply — so a customer taking three days to send a screenshot does not breach your SLA. `on_hold_pauses_sla` behaves the same way for tickets parked on hold.

## Where to configure

**Support → SLA policies** in the dashboard. Simpler setups can instead set a single response-time target under **Settings → Support → Escalation**, which flags an escalated ticket as overdue after the chosen number of hours.

## Related

- [Routing and assignment](/platform/customer-support/routing)
- [Tickets](/platform/customer-support/tickets)
- [Analytics](/platform/customer-support/analytics) — SLA compliance and first-response times
