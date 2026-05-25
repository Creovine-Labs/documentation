---
sidebar_position: 5
title: Chat history (formerly Inbox)
description: Read-only audit log of every AI chat. Use it to QA Lira's answers and spot accuracy drift.
---

# Chat history

The Chat history surface (previously called **Inbox**) is your read-only audit log of every AI ↔ visitor conversation, across email, the Web SDK / chat widget, and the hosted portal. It is **not** the primary operator queue — that's [Tickets](/platform/customer-support/tickets). (Voice is currently disabled behind a feature flag; voice transcripts will reappear here when voice is re-enabled.)

Navigate to **Support → Chat history** (sits below Analytics in the sidebar).

---

## What it's for

Use Chat history to:

- **Audit Lira's accuracy.** Spot-check a sample of recent chats. Did the AI give the right answer?
- **Investigate complaints.** A customer says "your AI told me wrong info" — pull the thread and see exactly what was said.
- **Find drift.** If CSAT drops, browsing recent chats often reveals what Lira got confused about.
- **Discover KB gaps.** Patterns of vague or hedged replies signal missing content in your Knowledge Base.

Use **Tickets** instead when you need to:

- Reply to a customer
- Track open work
- Mark something resolved

---

## Why both exist

| | **Chat history** | **Tickets** |
|---|---|---|
| Volume | Every chat (huge — most resolved by AI silently) | Only when Lira can't answer (small) |
| Purpose | QA / audit | Operator work queue |
| State | open / pending / resolved | open / in_progress / resolved / closed |
| Replies | Read-only by default | Reply triggers visitor email |

A single conversation in Chat history may have **spawned** one or more tickets (the agent calls `lira_create_support_ticket`). Where this happens, the ticket number is shown on the conversation detail page so you can jump between the two views.

---

## Conversation statuses

| Status | What it means |
|--------|--------------|
| **Open** | Active — Lira is handling it or waiting for a customer reply |
| **Pending** | Waiting — Lira sent a response and is waiting to hear back |
| **Escalated** | (Legacy) Flagged for human review. The new ticketing flow uses **Tickets**, not this status. |
| **Resolved** | Closed — the conversation has finished |

---

## Filtering and search

Use the status filter buttons to narrow the view. The search bar matches on **subject**, **customer name**, **email**, or **detected intent**.

---

## Reading a conversation row

Each row shows:

- Customer name (or "Chat visitor" for anonymous widget conversations)
- Sentiment emoji (😊 positive, 😐 neutral, 😠 frustrated)
- Status badge
- Subject / detected intent
- Tags (up to four)
- Short preview of the last message
- Time-ago
- CSAT stars (if rated)

---

## Viewing a conversation

Click any row to open the full thread. You can:

- Read the full message history
- See the channel (email / chat / portal; voice when re-enabled)
- View Lira's confidence score for each AI reply
- See the customer profile (name, email, history)
- (If applicable) Jump to the spawned ticket

Replies from this surface are de-emphasised by design — if a thread needs human follow-up, it should be a ticket, not a manual reply on an in-flight AI chat. Use Tickets for active operator work.

---

## Tips

**Sample, don't read everything.** Pick 20 chats from the last week and audit them. Look for hedges, "I don't know" replies, and tonal misses.

**Filter by CSAT \< 3.** Customers who rated below 3 stars often signal a gap in your Knowledge Base or a wrong answer.

**Cross-reference with Tickets.** If a ticket exists for a conversation, the chat history is the "before" of how Lira tried before opening the ticket. That's gold for prompt tuning and KB authoring.
