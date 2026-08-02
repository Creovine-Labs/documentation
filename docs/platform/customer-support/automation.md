---
slug: /platform/customer-support/automation
sidebar_position: 17
title: Automation & rules
description: Every automatic decision Lira makes on your behalf — escalation triggers, routing, SLA timers, auto-resolve — and where each is configured.
---

# Automation & rules

Lira makes a number of decisions without a human pressing anything. This page lists all of them in one place, with the condition that fires each one and where you change it. Nothing here is hidden: if Lira acts on its own, it is on this page.

## Escalation triggers

Bring in a human automatically when a conversation goes sideways. Each trigger is individually toggleable, and the ones with a threshold let you set it.

| Trigger | Fires when | Threshold |
| --- | --- | --- |
| **Negative sentiment** | The customer's tone turns negative or urgent after the first exchange. | — |
| **Repeated failure** | The customer keeps coming back and the AI is not resolving it. | Unanswered customer turns, default 3 |
| **VIP customer** | A VIP or enterprise customer raises a non-trivial intent. | — |
| **Going in circles** | The same question is rephrased several times. | Similar messages, default 3 |
| **SLA pressure** | The conversation has been open longer than your window. | Minutes open, default 30 |

**Where:** Settings → Support → Escalation → *When to bring in a human*.

## Forced escalation intents

A list of intents that always go to a human, no matter how confident the AI is. Use it for anything you never want automated — refunds, account closure, legal, complaints.

**Where:** Settings → Support → Behavior.

## Confidence gate

Every answer carries a retrieval confidence. Below your threshold, Lira escalates instead of guessing. Raising the threshold makes Lira more cautious and escalate more; lowering it makes it answer more and risk being wrong more often.

**Where:** Settings → Support → Behavior → *AI confidence threshold*.

## Routing

New tickets are classified by the AI, then routed by category to a queue and a team, with security-flagged tickets overriding to the Security queue. See [Routing & assignment](/platform/customer-support/routing).

## SLA timers

Routing attaches an [SLA policy](/platform/customer-support/sla). A background worker moves each ticket through **ok → at risk → breached** and notifies the assignee and team *before* the deadline, not after. Policies can pause the clock while you are waiting on the customer.

## Auto-resolve

Idle conversations resolve automatically after a configurable window, so your open count reflects real work rather than abandoned chats.

**Where:** Settings → Support → Behavior.

## Human takeover and handback

The moment a teammate replies on a ticket, the AI pauses on that conversation. It stays paused until handback, so the customer is never talking to both at once.

## Outbound delivery

Ticket `created`, `escalated` and `resolved` events fan out to your configured destinations — email always, plus optional Slack, Linear or a signed webhook. Deliveries are queued, retried with backoff, deduplicated, and logged in **Support → Outbox** with each attempt and its result. See [Integrations](/platform/customer-support/integrations).

## Proactive outreach

Behavioral triggers can start a conversation rather than wait for one — stalled onboarding, failed payments, friction signals — including `mobile_push` triggers that send a push notification to the customer's device. See [Proactive outreach](/platform/customer-support/proactive).

## Knowledge upkeep

- **Staleness detection** flags articles not updated within your configured window for human review.
- **Gap detection** surfaces questions your knowledge base could not answer, and drafts entries from escalations for a human to approve. Nothing is published to your knowledge base without approval.

## Not supported yet

Said plainly, because it is the difference between Lira and a mature helpdesk:

- **No rule builder.** There is no if/then editor where you compose arbitrary conditions, time delays and chained actions, and no library of prebuilt recipes. The automations above are individually configurable, but you cannot author new ones.
- **No AI-evaluated routing conditions** beyond the classifier's category and priority.
- **No unified automation log.** Outbox deliveries and ticket events are logged, but there is no single "why did this fire" timeline across every automation.
- **No macros or canned replies.**

If one of these is a hard requirement, it is worth telling us — this is the area we are actively deciding on next.
