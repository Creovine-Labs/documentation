---
sidebar_label: Lira
title: Talking to Lira
description: How Lira speaks to your customers, how to shape her tone, when she escalates, and what to expect from a typical conversation.
---

# Talking to Lira

Lira is the AI agent that handles conversations with your customers — in your chat widget, on your support portal, in proactive nudges. This page covers how she talks, how to shape her tone, when she hands off, and what your customers can expect.

---

## How Lira sounds by default

Lira is conversational and direct. She isn't chirpy. She doesn't open with "Sure!", "Absolutely!", "Great question!" or other filler. She uses short sentences and only the words a competent product support person would use to a real customer.

Specifically, by default she:

- Greets by first name on the first reply only — never repeats the name after that.
- Answers in 1–3 sentences when she can. Chips below the message do the heavy lifting for "what next?".
- Asks a clarifying question instead of guessing when something is genuinely ambiguous.
- Says "I don't know" out loud (and opens a ticket) instead of inventing an answer.
- Never uses em-dashes or closers like "feel free to reach out".

She's friendly, but she sounds like a product expert, not a chatbot.

---

## Customizing her tone

Two surfaces shape Lira's voice for your org:

### Organization profile

In **Settings → Organization** you set:

- **Company name + industry** — Lira reads this on every conversation and uses it to ground answers.
- **Description** — a short paragraph about what your product does.
- **Custom instructions** — free-form rules ("Always recommend the Pro plan for teams over 10 seats", "Never promise refunds in chat — always open a ticket"). These get prepended to her system prompt.

### Activation settings

In **Customer Support → Activate** (the wizard, runnable any time) you control:

- The **welcome message** customers see when they open the widget.
- The **handoff threshold** — how unsure Lira can be before she escalates.
- The **default escalation owner** — who tickets land with.
- The **operating hours** — outside which she sets expectations differently (e.g. "Our team is offline until 9am ET — I'll get this in front of them then.").

Together those two surfaces are usually enough. For deeper customization (per-channel tone, A/B testing greeting copy, etc.) reach out to the Lira team.

---

## What Lira does on a typical conversation

Lira's job on every visitor turn, in order:

1. **Read the visitor's message + the live product context** the SDK is pushing (current page, account state, plan, etc.).
2. **Search the knowledge base** for grounding content.
3. **Decide:** answer, run an action, ask for clarification, or escalate.
4. **Reply** — short, grounded, in your tone, with 2–4 suggestion chips picked from this turn's context (never a fixed menu).
5. **Log the turn** to chat history with the tool calls, KB matches, and live context attached so your team can audit later.

For identified visitors, the SDK can push extra context that scopes her answers — current invoice state, last action they tried, signed account info. See [Identified visitors](/platform/customer-support/widget) for the full signing model.

---

## When Lira runs an action vs. answers in chat

You wire up [actions](/platform/customer-support/actions) for the operations you want Lira allowed to do — cancel a subscription, retry a payment, update a plan, generate an invoice, etc. Each action has a confirmation policy:

- **Auto-confirm** — Lira runs immediately and reports the result. Use for low-risk, easily-reversible operations.
- **Require visitor approval** — Lira describes what she's about to do, shows a chip like "Yes, do that", and waits.
- **Require human review** — Lira opens a ticket; your team approves before the action runs.

When the visitor asks for something there's no action wired for — or the action exists but is policy-gated — Lira escalates instead.

---

## When Lira escalates

Lira opens a ticket and tells the visitor "I'm getting our team to look at this" in any of these cases:

- The visitor explicitly asks ("can I talk to a human", "is there a real person?").
- The question is product-specific (roadmap, pricing not on the public site, custom integration) and confidence is low.
- The visitor's request needs an action your team hasn't given Lira permission to run.
- Lira tried a tool and it returned an unrecoverable error.

The ticket includes the full chat transcript, the visitor's identity (if signed in), every tool call she made, and the KB snippets she pulled — so the human picking it up isn't starting from zero.

---

## What Lira will *not* do

- **Disclose account-specific data based on an email alone.** Email is not identity proof. For anything account-scoped (billing, plan, ticket history) she'll either route the visitor to log in or open a ticket.
- **Ask for a password in chat.** Ever.
- **Modify state silently.** Every action that changes something — cancel, charge, refund, add a teammate — either requires approval (per your action config) or gets flagged in the conversation log.
- **Make up an answer.** If the KB doesn't ground it and there's no tool that returns the truth, she says so and escalates.

These are baked into her system prompt, not a feature you opt into.

---

## Example exchange

> **Visitor:** my last invoice didn't go through
>
> **Lira:** Got it — looks like the payment on Nov 12 failed because the card on file expired. Want me to retry it on the same card, or switch to a new one?
>
> **chips:** [ Retry the same card ] [ Use a different card ] [ Talk to a human ]
>
> **Visitor:** *(clicks "Use a different card")*
>
> **Lira:** Opening the billing page for you so you can add a new card. Once it's saved I'll retry the failed invoice automatically.
>
> *(navigates the visitor to /billing; live context shows the new card was added; Lira retries; reports success)*

What happened under the hood:

- Lira read `live product context` and saw the visitor is signed in.
- She called the `lira_get_invoice_status` action — saw the most recent invoice failed and why.
- She offered chips matching that exact situation (not "show pricing" / "install widget" / a generic menu).
- After the visitor picked, she navigated their page (`lira_action` event the SDK consumes) and waited for the card-saved signal.
- She called `retry_invoice`, an action you defined.
- She summarized the result in one sentence.

That's the typical shape of a working Lira conversation.

---

## Quick reference

| Goal | What you configure |
|---|---|
| Change her welcome line | Customer Support → Activate → Welcome message |
| Tighten her tone | Settings → Organization → Custom instructions |
| Let her cancel subs | Settings → Support → Actions |
| Bias her toward escalation | Customer Support → Activate → Handoff threshold |
| Send tickets to a specific person | Customer Support → Activate → Default escalation owner |
| Audit what she said today | Work → Inbox |
