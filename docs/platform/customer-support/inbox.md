---
sidebar_position: 4
title: Inbox
description: Navigate the support inbox — filter conversations, understand statuses, reply to customers, and manage escalations.
---

# Inbox

The Inbox is the nerve centre of customer support. Every conversation — regardless of whether it arrived via email, chat widget, voice, or the support portal — lands here in a unified view.

Navigate to **Support → Inbox** (the default tab when you open the Support section).

---

## Conversation statuses

Each conversation moves through a lifecycle:

| Status | What it means |
|--------|--------------|
| **Open** | Active — Lira is handling it or waiting for a customer reply |
| **Pending** | Waiting — Lira sent a response and is waiting to hear back |
| **Escalated** | Flagged for human review — Lira wasn't confident enough or an escalation rule triggered |
| **Resolved** | Closed — the customer's issue has been addressed |

---

## Metrics at a glance

At the top of the Inbox panel are four metric cards (collapse or expand with the chevron button):

- **Open** — how many conversations are currently active
- **Autonomous** — how many have been resolved by Lira without human intervention
- **Escalated** — how many are currently waiting for a human response
- **Avg CSAT** — average customer satisfaction score across all rated conversations (on a 1–5 scale)

These update in real time as conversations come in and change state.

---

## Filtering conversations

Use the status filter buttons to narrow the view:

- **All** — every conversation
- **Open** — active conversations
- **Pending** — awaiting customer reply
- **Escalated** — flagged for human review
- **Resolved** — closed conversations

The search bar lets you filter by **subject**, **customer name**, **customer email**, or **detected intent**. This is useful when a customer follows up and you want to find their original thread quickly.

---

## Reading a conversation row

Each conversation card shows:

- **Customer name** (or "Chat visitor" for anonymous widget conversations), with a coloured initial avatar
- **Sentiment indicator** — an emoji reflecting the customer's last message tone (😊 positive, 😐 neutral, 😠 frustrated)
- **Status badge** — colour-coded by status
- **Subject / intent** — what the conversation is about (derived from the subject line, detected intent, or first message)
- **Tags** — up to four classification tags, with a "+N" indicator if there are more
- **Preview** — a short summary or the last message snippet
- **Time ago** — how recently the last activity occurred
- **CSAT stars** — if the customer has rated the conversation

---

## Viewing a conversation

Click any row to open the full conversation thread. From there you can:

- Read the full message history
- See which channel the conversation came through (email, chat, voice, portal)
- View Lira's confidence score for each AI reply
- Reply manually as your team
- Escalate or resolve the conversation
- View the customer profile (name, email, conversation history, CRM links)

---

## Escalated conversations

When Lira escalates a conversation, it means one of the following happened:

1. **Confidence was below your threshold** — Lira didn't have enough certainty to respond autonomously
2. **A force-escalate intent was detected** — the conversation matched an intent you've configured to always require human review (e.g. `data_privacy`, `account_security`, `legal`, `fraud`)
3. **Your escalation Slack channel or email was notified** — your team receives an alert wherever you've configured escalation notifications

To handle an escalated conversation: open it in the Inbox, write your reply, and mark it resolved when done.

---

## Customer profiles

Each conversation is linked to a customer profile. You can access the full profile by clicking the customer's name in the conversation list. The profile shows:

- Contact details (name, email)
- Conversation history
- CRM links (HubSpot contact, Salesforce contact — if integrations are connected)
- Sentiment trend over time

The **Customers** tab at the top of the Support page gives you a searchable directory of all customers who have contacted support.

---

## Tips for your team

**Process escalated tickets first** — filter by "Escalated" status to prioritise conversations that have been flagged.

**Use tags** — Lira automatically tags conversations based on detected intent (e.g. `billing`, `onboarding`, `bug-report`). Use these tags when searching for similar past tickets.

**Check CSAT regularly** — conversations where customers rate below 3 stars often signal a gap in your Knowledge Base. Opening the conversation can reveal what Lira got wrong, so you can improve your docs.

**Expand the stats panel** — if you're managing a busy team, keep the metrics panel visible to stay on top of open and escalated counts at a glance.
