---
sidebar_position: 6
title: Proactive Outreach
description: Automatically reach out to customers based on events — configure triggers, message templates, channels, cooldowns, and monitor the activity log.
---

# Proactive Outreach

Proactive outreach lets Lira initiate conversations with customers based on events in your system — without the customer needing to reach out first.

Navigate to **Support → Proactive**.

---

## What is proactive outreach?

Most support is reactive — a customer has a problem and contacts you. Proactive outreach flips this: Lira monitors events in your connected systems and reaches out to customers *before* they need to ask for help.

**Examples of proactive outreach:**

- A customer's payment fails → Lira emails them with instructions to update their card
- A subscription is about to expire → Lira sends a reminder
- An order is delayed → Lira notifies the customer with an update
- A customer hasn't logged in for 30 days → Lira sends a re-engagement message

Each outreach is personalised using template variables and sent via email or voice.

---

## Creating a trigger

Click **New Trigger** at the top right of the Proactive tab. A form appears:

### Trigger Name
A descriptive label for your reference (e.g. *"Payment Failed Alert"*, *"Subscription Expiry Reminder"*). Names are not seen by customers.

### Event Type
The event from your system that fires this trigger (e.g. `payment.failed`, `subscription.expiring`, `order.delayed`). This is an event identifier that your backend or integration sends to Lira.

### Message Template
The message Lira will send to the customer. Use double-curly-brace variables to personalise:

```
Hi {{customer.name}},

We noticed your payment for your {{plan}} subscription failed.
Please update your payment details to avoid any interruption.

— {{org.name}} Support
```

Available variables:

| Variable | Value |
|----------|-------|
| `{{customer.name}}` | Customer's display name |
| `{{customer.email}}` | Customer's email address |
| `{{org.name}}` | Your organisation name |

Additional variables depend on the event payload sent from your backend.

### Channel
Choose how the outreach is delivered:

- **Email** — sent to the customer's registered email address
- **Voice** — Lira calls the customer's phone number using AI voice

### Cooldown (hours)
The minimum time (in hours) between outreach attempts to the same customer for the same trigger. This prevents a customer from receiving the same message repeatedly if the triggering event fires multiple times.

For example, a cooldown of `24` means Lira won't contact the same customer more than once per day for that trigger.

### Max per day
The maximum number of outreach messages this trigger can send across all customers in a single day. Use this as a safety cap to prevent runaway triggers.

---

## Managing triggers

Your configured triggers appear as cards in the **Triggers** tab, showing:

- Trigger name
- Event type it listens for
- Delivery channel
- Cooldown period
- An **On/Off toggle** — enable or disable the trigger without deleting it

Use the **delete** (trash) button to permanently remove a trigger.

---

## Activity Log

The **Activity Log** tab shows a table of every outreach message Lira has sent. Each row includes:

- **Trigger** — which trigger fired
- **Customer** — who was contacted
- **Channel** — email or voice
- **Status** — `sent`, `delivered`, or `failed`
- **Timestamp** — when the outreach was sent

Use the activity log to verify that your triggers are firing correctly and to investigate any `failed` deliveries.

---

## Best practices

**Start conservative** — set generous cooldowns (24–72 hours) when first configuring triggers. You can tighten them once you've confirmed the trigger is working as expected.

**Test with a small segment first** — if your event system is high-volume, add an initial Max/Day cap (e.g. `10`) to limit exposure while you evaluate message quality.

**Personalise the message** — a message that uses the customer's name and references their specific situation dramatically outperforms a generic blast.

**Monitor the activity log weekly** — frequent `failed` statuses indicate a configuration or integration issue that needs attention.

**Use the voice channel selectively** — voice outreach is powerful but intrusive. Reserve it for high-urgency events (e.g. payment failure, security alert). Use email for lower-urgency updates.
