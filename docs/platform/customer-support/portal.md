---
sidebar_position: 5
title: Hosted Portal
description: Configure the Lira-hosted fallback support page for temporary no-code launches and support links.
---

# Hosted Portal

The Hosted Portal is a Lira-hosted fallback page where customers can submit
support tickets, track conversations, and live-chat with Lira.

For production B2B apps, the recommended integration is the
[Web SDK and full-page support embed](/platform/customer-support/web-sdk). That
lets a company run support inside its own app route, such as
`lemonpay.com/support`, while Lira provides the support runtime.

Your portal lives at:

```
https://support.liraintelligence.com/your-slug
```

---

## When to use the hosted portal

Use the hosted portal when:

- You need a temporary no-code support link.
- The customer cannot ship a product change yet.
- You want a fallback link in email signatures or onboarding docs.
- You are testing the support workflow before installing the SDK.

Do not use the hosted portal as the main integration for customers who want
support inside their own product. Use the Web SDK instead.

---

## Enabling the portal

### During activation

In [Step 2 of the activation wizard](/platform/customer-support/activation#step-2--web-surfaces-and-channels), check the **Hosted Portal Fallback** option and enter your portal slug.

### After activation

Go to **Settings → Support → Hosted**. Toggle the hosted fallback on, then set your slug.

---

## Choosing a portal slug

Your slug is a short, lowercase identifier that becomes part of your portal URL. Rules:

- Lowercase letters, numbers, and hyphens only
- Maximum 100 characters
- Must be unique across Lira's platform

**Examples:**

| Company | Slug | Portal URL |
|---------|------|------------|
| Acme Corp | `acme-corp` | `support.liraintelligence.com/acme-corp` |
| Bright Software | `bright` | `support.liraintelligence.com/bright` |
| TechFlow Inc | `techflow-inc` | `support.liraintelligence.com/techflow-inc` |

Choose something recognisable to your customers — ideally your company name or a close abbreviation.

:::caution Changing your slug
If you update the slug after publishing your portal URL (in emails, help docs, or your website), the old URL will stop resolving. Update any links you've already shared whenever you change the slug.
:::

---

## What customers see on the hosted portal

When a customer visits your portal URL they can:

1. **Submit a new ticket** — fill in their name, email, and a description of their issue
2. **Chat with Lira** — get immediate AI responses without waiting for email
3. **Track ticket status** — see whether their ticket is open, pending, escalated, or resolved

Every ticket submitted through the portal lands in your **Tickets** queue alongside email and chat conversations.

---

## Sharing the portal URL

After enabling the portal, you can find the live URL any time:

- In **Settings → Support → Hosted** — click **Open portal**
- In the **Success screen** immediately after activation (with a copy button)

Share the URL:

- In email signatures and auto-replies
- On your website's contact or support page
- As a link when customers ask "how do I reach support?"

---

## Do not iframe the hosted portal

The older iframe approach is no longer the recommended path. If customers should
stay on their own domain, mount Lira with the Web SDK:

```html
<div id="lira-support-root" style="height: 720px;"></div>
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-mode="fullscreen"
  data-target="#lira-support-root">
</script>
```

[→ Full Web SDK guide](/platform/customer-support/web-sdk)

---

## Hosted portal vs Web SDK vs chat widget

All three use Lira's support runtime, but they serve different product needs:

| | Web SDK | Chat Widget | Hosted Portal |
|--|---------|-------------|---------------|
| **Best for** | Main in-app support route | Quick support launcher | Temporary no-code fallback |
| **Installation** | Mount inside your route | Script tag in HTML | Share URL |
| **Domain** | Your domain | Your domain | Lira or custom fallback domain |
| **Identity/context** | Full signed identity + live context | Signed identity supported | Email/magic-link based |
| **Recommended for B2B** | Yes | As an add-on | Fallback only |

Most B2B products use the Web SDK for `/support`, then add the floating widget
on pages where a compact launcher helps.

---

## Portal settings reference

All hosted portal settings live in **Settings → Support → Hosted**:

| Setting | Description |
|---------|-------------|
| **Enabled toggle** | Turn the portal on or off globally |
| **Portal slug** | The URL identifier (e.g. `acme-corp`) |
| **Open portal link** | Opens your live portal in a new tab (appears once your slug is saved) |

For widget colour and greeting, see [Widget settings](/platform/customer-support/widget).
For escalation and SLA configuration, see [Settings Reference](/platform/customer-support/settings).
