---
sidebar_position: 6
title: Proactive Outreach
description: Automatically reach customers at exactly the right moment — before they have to ask. Learn how to set up proactive outreach rules, channels, webhooks, and templates.
---

# Proactive Outreach

Most customer support is reactive — a customer has a problem, they get frustrated, they contact you. Proactive outreach is different: **you reach out first**, right when something important happens in your product.

:::info Delivery channels
Proactive outreach is channel-aware. **Available today:** email and the embedded Lira widget / Web SDK. **Coming soon:** web push, mobile push, and SMS. Email is the fastest channel to start with.
:::

Navigate to **Support → Proactive**.

:::tip Who reads this guide?
This guide is written for everyone — marketing, operations, product, and developers. The concepts are explained in plain language. Technical setup (connecting your backend) is covered step-by-step at the end, and your developer can complete it in under 30 minutes.
:::

---

## Think of it like a smart notification system for your business

Your product already knows when important things happen — a trial is about to end, a payment fails, a customer hasn't logged in for a month. Normally, those moments come and go silently. Your customer waits, gets frustrated, or just leaves without saying anything.

Proactive outreach gives your team the ability to act on those moments automatically. You define the rule once ("when a trial expires in 3 days, send this reminder"), choose the delivery channel, and Lira handles the rest — finding the customer, delivering the outreach, and logging the result.

**The key insight:** your customers don't contact you because they're busy. They just want things to work. Proactive outreach lets you show up for them before they even have to ask.

---

## Real-world examples

Here are some examples of situations where proactive outreach makes a real difference. These are not features to configure — they are scenarios to help you picture what you can build:

| When this happens in your product… | Lira can automatically… |
|--------------------------------------|---------------------|
| A customer's trial expires in 3 days | Send a friendly reminder with upgrade options |
| A payment method is declined | Send clear billing update instructions |
| A subscription renews in 7 days | Send a heads-up so there are no surprises on renewal day |
| You launch a new feature | Notify active customers with a short announcement |
| A customer hasn't logged in for 30 days | Send a re-engagement message |
| A support ticket has been open for 48 hours | Send a status update so the customer knows you're on it |
| A service they rely on goes down | Send an alert with a link to your status page |

You decide exactly which events matter to your business. If your product tracks it, you can trigger a message from it.

---

## How it works — the big picture

There are two pieces to proactive outreach:

1. **A rule** — you create this in the Lira dashboard. It says: "when event X happens, send this outreach."
2. **Your product sending events** — your backend sends a small signal to Lira whenever that event occurs (e.g. a trial expiring, a payment failing).

When both pieces are in place, Lira handles everything else: matching the event to the right customer, checking whether the selected channel is connected, delivering the outreach, and making sure the same customer isn't contacted repeatedly by respecting cooldowns.

```
Your product → sends an event to Lira (via webhook)
Lira → matches the event to one of your rules
Lira → looks up the customer and selected channel
Lira → delivers the outreach
Lira → logs the delivery in your Activity Log
```

You don't need to manage any of this manually. Once set up, it runs automatically.

---

## Step 1 — Create a trigger

Go to **Support → Proactive → Triggers** and click **New Trigger**.

### Trigger Name

Give it a clear internal name so you can identify it later. This is only visible to your team, not your customers.

**Good examples:** `Trial Expiry Reminder`, `Payment Failed Alert`, `New Feature Announcement`

### Event Type

This is the name of the event your product will send to Lira when the trigger should fire. You choose the name — it just needs to match exactly between what you create here and what your backend sends.

**Convention:** use lowercase with dots. For example:
- `trial.expiring`
- `payment.failed`
- `feature.released`
- `invoice.overdue`

You'll come back to this exact string when setting up the backend connection in Step 2.

### Message Template

This is what Lira sends to your customer. You can personalise it using `{{variables}}`:

```
Hi {{customer.name}},

Just a heads-up — your Nimbus trial ends in 3 days.

If you have any questions about upgrading, just reply to this message and our team will help you pick the right plan.

— The Nimbus Team
```

**Available variables:**

| Variable | What it shows |
|----------|---------------|
| `{{customer.name}}` | The customer's name |
| `{{customer.email}}` | The customer's email address |
| `{{org.name}}` | Your organisation name |

You can also include any custom fields from your event payload (ask your developer to include them when sending the event).

### Delivery Channel

How the outreach is delivered. Pick the channel that matches where your customer is most likely to see and act on the message.

| Channel | Best for | What must be configured |
|---------|----------|-------------------------|
| **Email** | Billing notices, renewals, account reminders, official updates | Customer email in **Support → Customers** |
| **In-app widget** | Reaching a customer while they are actively using your website or app | Lira widget installed and the visitor linked to a customer record |
| **Web push** | Browser notifications after a customer opts in | Push subscription setup in the widget/service worker |
| **SMS** | Urgent billing, renewal, outage, or security alerts | SMS sender configured and customer phone numbers on file |
| **Mobile push** | Native iOS/Android app notifications | Your mobile app must pass device tokens to Lira and connect push credentials |
| **Voice** _(currently disabled)_ | High-urgency outreach where a call is appropriate | Voice runtime is feature-flagged off while call quality improves. Returns in a future release. |

If a rule fires before its channel is configured, Lira records the attempt as `failed` in the Activity Log with the missing setup reason. That is intentional: it prevents silent delivery gaps.

---

## Channel setup guide

### Email

Email is the easiest starting point. Add or import customers with email addresses in **Support → Customers**, then choose **Email** when creating the rule.

### In-app widget

Install the Lira widget on your product. When a visitor is linked to a customer record, Lira can open a proactive conversation inside the widget. This is useful for customers who are actively logged in or browsing your product.

### Web push

Web push lets Lira send browser notifications to your customers even when they are not on your site. Complete the setup once — then all future proactive rules can use it as a delivery channel.

**Step 1 — Add the service worker file**

Create a file called `lira-sw.js` at the root of your website (e.g. `https://yourdomain.com/lira-sw.js`). The file must be served from the same origin as your site.

```js
// lira-sw.js — place at your website root
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'New message', {
      body: data.body ?? '',
      icon: '/favicon.ico',
    })
  )
})
```

**Step 2 — Add the subscription snippet to your site**

In the Lira dashboard, open **Support → Proactive Outreach**, click **Web push**, then **Set up Web push**. The modal shows your org's VAPID public key and a ready-to-paste script tag. Add it to your site HTML after the Lira widget script.

The snippet registers the service worker, requests browser notification permission, and POSTs the push subscription to:

```
POST https://api.creovine.com/lira/v1/support/push/subscribe
```

Body fields: `orgId`, `endpoint`, `p256dh`, `auth`, and optionally `visitorId` (Lira visitor ID from `localStorage.getItem('lira_visitor_id')`).

**Step 3 — Verify connection**

Open your site in a browser and allow the notification prompt. Then return to the Web push setup modal and click **Check connection**. Lira queries:

```
GET https://api.creovine.com/lira/v1/support/push/status?orgId=...
```

Once at least one subscription is registered, the Web push channel is marked as **Connected** and can be selected in proactive rules.

**VAPID keys**

Lira auto-generates a unique VAPID key pair per org on first use and stores it securely. You do not need to generate or manage keys manually — the modal shows your public key. The private key is never exposed.

### Mobile push

Mobile push is for organisations with a native iOS or Android app. Your app needs to send device tokens to Lira, and your organisation needs to provide push credentials for APNs or FCM. Once configured, proactive rules can deliver native push notifications.

### Voice

Voice outreach is best for high-urgency cases. Use it carefully, because calls are more intrusive than email, push, or in-app messages.

### Cooldown (hours)

How long Lira will wait before sending the same customer the same message again. This protects your customers from being messaged repeatedly if the same event fires multiple times.

- Set to `24` to prevent more than one message per day
- Set to `168` (7 days) for weekly reminders
- For a one-time announcement, set to something very high like `8760` (1 year)

### Max per day

The maximum number of messages this single trigger can send across all your customers in one day. This is a safety net — if something goes wrong in your event system and it fires thousands of events, this cap prevents a mass message blast.

A reasonable default is `50–100` until you've confirmed everything is working.

---

## Step 2 — Connect your backend

:::info This step is for developers
The next section is technical. If you're on the marketing or operations team, you can stop here and hand this guide to your developer. Everything from this point is a one-time backend setup that takes under 30 minutes.
:::

Your triggers are ready, but they won't fire until your product actually sends events to Lira. Here's how to do that.

### Your webhook endpoint

Every Lira organisation has a unique inbound URL. This is the address your backend will send events to:

```
POST https://api.creovine.com/lira/v1/support/webhooks/inbound/{your-org-id}
```

Replace `{your-org-id}` with your actual org ID. You can find your org ID in **Support → Proactive → Triggers** (it's pre-filled in the integration panel shown on that page).

### Security — signing your requests

Every event you send must be **signed** so Lira can verify it genuinely came from your system. This prevents anyone else from triggering messages in your name.

**How signing works:**
1. Take the raw JSON body of your request
2. Create an HMAC-SHA256 hash of it using your org ID as the secret key
3. Send the hash as a request header called `x-lira-signature`

Your org ID is both your identifier and your signing secret. Keep it private — treat it like a password.

### The event payload

Send a JSON body with these fields:

```json
{
  "event": "trial.expiring",
  "customerId": "cust_abc123",
  "data": {
    "days_left": 3
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `event` | ✅ Yes | The Event Type from your trigger — must match exactly |
| `customerId` | ✅ Yes | The customer's ID as it appears in **Support → Customers** |
| `data` | No | Any extra context (available in templates as variables) |

### Node.js example

```javascript
const crypto = require('crypto');

const ORG_ID = process.env.LIRA_ORG_ID; // your Lira org ID
const ENDPOINT = `https://api.creovine.com/lira/v1/support/webhooks/inbound/${ORG_ID}`;

async function sendLiraEvent(event, customerId, data = {}) {
  const body = JSON.stringify({ event, customerId, data });

  const signature = crypto
    .createHmac('sha256', ORG_ID)
    .update(body)
    .digest('hex');

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-lira-signature': signature,
    },
    body,
  });

  return response.json();
}

// Example usage:
await sendLiraEvent('trial.expiring', 'cust_abc123', { days_left: 3 });
// → { ok: true, accepted: true }
```

Store `LIRA_ORG_ID` as an environment variable on your server — never hard-code it in your source code.

### Python example

```python
import hmac
import hashlib
import json
import os
import requests

ORG_ID = os.environ['LIRA_ORG_ID']
ENDPOINT = f"https://api.creovine.com/lira/v1/support/webhooks/inbound/{ORG_ID}"

def send_lira_event(event: str, customer_id: str, data: dict = {}):
    body = json.dumps({"event": event, "customerId": customer_id, "data": data})

    signature = hmac.new(
        ORG_ID.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()

    response = requests.post(ENDPOINT, data=body, headers={
        "Content-Type": "application/json",
        "x-lira-signature": signature,
    })

    return response.json()

# Example usage:
send_lira_event("trial.expiring", "cust_abc123", {"days_left": 3})
# → {"ok": True, "accepted": True}
```

### Testing with curl

```bash
ORG_ID="your-org-id-here"
CUSTOMER_ID="cust_abc123"
BODY="{\"event\":\"trial.expiring\",\"customerId\":\"$CUSTOMER_ID\",\"data\":{\"days_left\":3}}"

SIG=$(node -e "
  const crypto = require('crypto');
  const body = process.argv[1];
  const secret = process.argv[2];
  console.log(crypto.createHmac('sha256', secret).update(body).digest('hex'));
" "$BODY" "$ORG_ID")

curl -X POST "https://api.creovine.com/lira/v1/support/webhooks/inbound/$ORG_ID" \
  -H "Content-Type: application/json" \
  -H "x-lira-signature: $SIG" \
  --data "$BODY"
```

A successful response looks like:

```json
{ "ok": true, "accepted": true }
```

---

## Step 3 — Verify in the Activity Log

After sending a test event, go to **Support → Proactive → Activity Log**. Within a few seconds you should see a row with:

- The trigger name
- The customer it was sent to
- Status: `sent`

If you see `skipped`, it means the cooldown period hasn't elapsed since the last message to that customer — this is working as intended. If you see `failed`, check that:

1. The `event` field exactly matches the Event Type on your trigger
2. The `customerId` matches a record in **Support → Customers**
3. The selected channel is configured for your organisation
4. The customer has the required contact detail for that channel, such as email, phone, active widget session, or push subscription
5. Your HMAC signature is correctly computed

---

## Managing your triggers

Once you have triggers running, the **Triggers** tab shows all of them. You can:

- **Toggle on/off** — temporarily pause a trigger without deleting it. Useful during product deployments or quiet periods.
- **Delete** — permanently remove a trigger. Events that arrive for a deleted trigger are silently ignored.

---

## Activity Log

The **Activity Log** tab is your real-time view of everything Proactive is doing. Each row shows:

| Column | What it means |
|--------|---------------|
| Trigger | Which rule fired |
| Customer | Who received the message |
| Channel | How it was sent, such as email, widget, SMS, or push |
| Status | `sent` · `skipped` · `failed` |
| Time | When Lira processed the event |

**Status meanings:**
- `sent` — message was delivered successfully
- `skipped` — cooldown or daily limit prevented the message (customer is protected from duplicates)
- `failed` — delivery failed; check the channel setup and required customer contact details

---

## Best practices

**Write messages that sound human, not automated.** The best proactive messages read like a note from a real person on your team. Use the customer's name, be specific about what happened, and make it easy to reply or take action.

**Start with one trigger.** Pick the single most impactful event — usually `payment.failed` or `trial.expiring` — and get that working end-to-end before adding more. Once you see it work, the rest are easy to add.

**Set conservative cooldowns at first.** A 24-hour cooldown is a safe starting point. You can reduce it later once you've confirmed the trigger is behaving as expected.

**Keep messages short.** 3–5 sentences is ideal for email outreach. People read the first line, scan the rest, and act on the call to action. Long messages get ignored.

**Review the Activity Log after your first week.** Look for patterns: are any triggers consistently `failed`? Are any customers receiving messages too frequently? The log tells you exactly what's happening.
