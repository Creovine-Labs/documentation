---
sidebar_position: 2
title: Support Portal
description: Set up your branded self-service portal — what it is, why it matters, how to configure your slug, and how to embed it on your website.
---

# Support Portal

The Support Portal is a publicly hosted, branded page where your customers can submit support tickets, track the status of their existing conversations, and live-chat with Lira — all without emailing or calling anyone.

Your portal lives at:

```
https://support.liraintelligence.com/your-slug
```

---

## Why a support portal?

Email and chat widget are great for reactive support — a customer has a problem and reaches out. The portal adds a **structured, self-service layer**:

- Customers can track ticket status without needing to reply to an email thread
- Reduces "any update?" follow-up emails
- Gives customers a single destination to bookmark as your help hub
- Can be embedded directly into your own website so customers never leave your domain

---

## Enabling the portal

### During activation

In [Step 2 of the activation wizard](/platform/customer-support/activation#step-2--channels), check the **Support Portal** option and enter your portal slug.

### After activation

Go to **Support → Settings → Channels tab**. The **Support Portal** section is at the top of the tab. Toggle the switch to enable it, then set your slug.

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

## What customers see on the portal

When a customer visits your portal URL they can:

1. **Submit a new ticket** — fill in their name, email, and a description of their issue
2. **Chat with Lira** — get immediate AI responses without waiting for email
3. **Track ticket status** — see whether their ticket is open, pending, escalated, or resolved

Every ticket submitted through the portal lands in your **Inbox** alongside email and chat conversations — your team manages everything from one place.

---

## Sharing the portal URL

After enabling the portal, you can find the live URL any time:

- In **Settings → Channels → Support Portal** — click **Open portal**
- In the **Success screen** immediately after activation (with a copy button)

Share the URL:

- In your product's help menu or footer
- In email signatures and auto-replies
- On your website's contact or support page
- As a link when customers ask "how do I reach support?"

---

## Embedding the portal on your website

You can embed the portal directly in your site as an iframe so customers never navigate away. After activation, you'll see an iframe snippet in the success screen. You can also generate it manually:

```html
<iframe
  src="https://support.liraintelligence.com/your-slug?embed=true"
  width="100%"
  height="700"
  frameborder="0"
  style="border: none; border-radius: 12px;">
</iframe>
```

Replace `your-slug` with your actual portal slug. The `?embed=true` parameter adjusts the portal layout to fit cleanly inside an iframe.

**Tips for embedded portals:**

- Set `height` to at least `600px` for comfortable ticket browsing
- Use `width="100%"` so it's responsive across screen sizes
- Place it on a dedicated "Support" or "Help" page rather than inline on product pages

---

## Portal vs chat widget — which to use?

Both let customers contact support through Lira. They serve slightly different purposes:

| | Chat Widget | Support Portal |
|--|-------------|----------------|
| **Best for** | Quick questions while on your site | Formal ticket submission & tracking |
| **Installation** | Script tag in HTML | Share URL or embed iframe |
| **Branding** | Uses your widget colour | Full branded page |
| **Ticket tracking** | Conversation history in chat | Status tracking by ticket |
| **Customer auth** | Anonymous or email | Email identified |

Most organisations enable **both** — the widget for quick help, and the portal linked from their help centre.

---

## Portal settings reference

All portal settings live in **Support → Settings → Channels tab → Support Portal**:

| Setting | Description |
|---------|-------------|
| **Enabled toggle** | Turn the portal on or off globally |
| **Portal slug** | The URL identifier (e.g. `acme-corp`) |
| **Open portal link** | Opens your live portal in a new tab (appears once your slug is saved) |

For widget colour and greeting, see [Widget settings](/platform/customer-support/widget).
For escalation and SLA configuration, see [Settings Reference](/platform/customer-support/settings).
