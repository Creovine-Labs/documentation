---
sidebar_label: Email
---

# Email Settings

Lira uses email to keep your team informed — sending meeting summaries, task assignments, and follow-ups automatically. This page covers all email configuration options available under **Workspace → Email → Settings**.

:::tip Navigation
In the left sidebar, expand **Workspace** and click **Email**. At the top of the Email page you'll see two tabs: **Settings** and **Inbox**. Click **Settings**, then use the sub-tabs — **General**, **Sender Identity**, **Sending Domain**, **Notifications**, **Auto-Reply** — to configure each option.
:::

---

## Sender Identity {#sender-identity}

The **Sender Identity** controls how Lira appears in your recipients' inboxes.

### From Name

The **From Name** is the display name shown before the email address — for example `Lira <lira@liraintelligence.com>`. You can change this to your company name, a team name, or anything that makes sense for your organization (e.g. `Acme AI <lira@acme.com>`).

> **Default:** `Lira`

### Sending Address

By default, Lira sends all emails from **lira@liraintelligence.com**. Once you set up and verify a [custom sending domain](#sending-domain), Lira will switch automatically to **lira@yourdomain.com**.

Lira sends emails for:
- **Meeting summaries** — delivered after each meeting ends
- **Task assignments** — when a task is created or updated
- **Follow-up reminders** — triggered by AI-detected action items
- **Notification events** — configurable under [Notifications](#notifications)

---

## Custom Sending Domain {#sending-domain}

A custom sending domain lets Lira send emails from your own domain (e.g. `lira@yourcompany.com`) instead of `lira@liraintelligence.com`. This improves deliverability and makes emails look native to your brand.

### Setup Steps

**Step 1 — Enter your domain**

Type your root domain (e.g. `yourcompany.com`) in the domain input and click **Register**. Do not include `lira@` or any subdomain — just the bare domain.

**Step 2 — Add DNS records**

Lira will generate three DNS records you must add to your DNS provider:

| Type | Purpose |
|------|---------|
| `TXT` | SPF — authorizes Lira's mail servers to send on your behalf |
| `CNAME` | DKIM — cryptographic signature that proves email authenticity |
| `CNAME` | Tracking — enables open/click tracking (optional) |

Log in to your DNS provider and add each record exactly as shown:

- **Cloudflare**: DNS → Add Record
- **Namecheap**: Advanced DNS → Add New Record
- **AWS Route 53**: Hosted Zones → your domain → Create Record
- **GoDaddy**: DNS → Add Record

:::tip Provider note
Some providers (e.g. GoDaddy, cPanel) automatically append your domain to the Name field. If your record name already ends with `.yourcompany.com`, enter only the subdomain part shown in the table.
:::

**Step 3 — Verify**

After adding the DNS records, click **Verify**. Lira polls your DNS every 8 seconds. Propagation typically takes 5–30 minutes; in rare cases up to 48 hours.

### Status Indicators

| Status | Meaning |
|--------|---------|
| **Pending DNS** | Records registered but not yet propagated |
| **Verified** | Domain fully set up — Lira is now sending from your domain |

### After Verification

Once verified, all outgoing emails automatically switch to `lira@yourdomain.com`. The Sender Identity section will reflect the new address. You do not need to re-verify unless you remove the DNS records.

---

## Email Notifications {#notifications}

Email notifications let you control which events trigger automated emails to your team members.

### Enable / Disable

Toggle **Enable email notifications** to turn all notification emails on or off for your organization. Individual event types can be further configured below.

### Event Types

| Event | When it fires |
|-------|--------------|
| **Task Created** | A new task is assigned to a team member (via AI extraction or manually) |
| **Task Completed** | A task is marked as complete |
| **Meeting Ended** | A meeting recording session finishes |
| **Summary Ready** | A meeting summary and transcript have been processed and are available |

You can independently enable or disable each event. For example, you might enable **Summary Ready** but disable **Task Created** if you prefer team members to discover tasks in-app rather than by email.

---

## AI Auto-Reply {#auto-reply}

AI Auto-Reply allows Lira to autonomously respond to inbound email replies using GPT-4o.

### How it works

When a recipient replies to a Lira-sent email (e.g. a meeting summary or task notification), Lira reads the reply and generates a contextual response — answering questions, acknowledging confirmations, or escalating complex requests.

### When it's disabled

If you turn off AI Auto-Reply, **all inbound email replies are immediately forwarded to your organization's admins** for manual follow-up. No automated response is sent.

### Use cases for disabling

- You prefer a human to handle all reply communication
- Compliance requirements mandate human review of outbound communications
- You are in a high-stakes industry (legal, healthcare, finance) where AI responses require review

:::info
AI Auto-Reply only applies to replies to Lira-sent emails. Cold inbound emails to your organization's inbox are not affected.
:::
