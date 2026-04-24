---
sidebar_position: 7
title: Analytics
description: Understand your support performance — CSAT, resolution rates, response times, and weekly reports.
---

# Analytics

The Analytics tab gives you a clear picture of how Lira is performing as your support layer — how many conversations it's handling autonomously, how customers are rating their experience, and where escalations are happening.

Navigate to **Support → Analytics**.

---

## Overview tab

The Overview tab shows your aggregate performance metrics.

### Key metrics

Four headline numbers appear at the top:

| Metric | What it tracks |
|--------|---------------|
| **Total Conversations** | All conversations received in the selected period |
| **Autonomous** | How many were resolved by Lira without human intervention |
| **Escalated** | How many were flagged for human review |
| **Avg CSAT** | Average customer satisfaction score (out of 5) across all rated conversations |

A high **Autonomous** count and a high **Avg CSAT** together indicate a healthy support operation — Lira is resolving conversations independently and customers are satisfied with the quality.

---

### Resolution breakdown

A horizontal bar chart showing how conversations resolved:

| Category | Meaning |
|----------|---------|
| **Autonomous** (green) | Resolved by Lira without human intervention |
| **Human** (blue) | Resolved by your team after manual review |
| **Escalated** (red) | Currently escalated or closed after escalation |
| **Open** (amber) | Still active — not yet resolved |

A high autonomous rate means your Knowledge Base is well-populated and your confidence threshold is calibrated well. A high escalation rate may indicate gaps in your Knowledge Base or a threshold that's set too conservatively.

---

### Average first response time

The average time between a customer's first message and Lira's first reply. Because Lira responds programmatically, this is typically sub-5 seconds for chat and widget conversations, and slightly longer for email (due to email delivery latency).

This metric matters for customer experience and SLA compliance. If you've set an **SLA Target** in escalation settings, tickets that breach it appear highlighted in your Inbox.

---

### Monthly usage

A simple count of:

- **Conversations this month** — total conversations started in the current calendar month
- **AI replies this month** — total AI-generated replies sent

Compare these against your plan limits (visible in **Settings → Behaviour → Volume & Limits**) to track your usage trajectory.

---

## Weekly Report tab

The Weekly Report gives you a snapshot of the most recent 7-day period — useful for Monday reviews and team reporting.

### Summary card

Shows the date range covered and four metrics side-by-side:

- Conversations
- Autonomous resolutions
- Escalations
- Average CSAT

### Top intents

A ranked list of the most common intents detected in conversations during the week. This reveals:

- What your customers ask about most
- Whether your Knowledge Base has adequate coverage for those topics
- Opportunities to create proactive triggers for high-volume, low-complexity intents

If `billing` or `refund` appears often, for example, consider adding a detailed billing FAQ to your Knowledge Base.

### Knowledge improvement

Shows how many **Knowledge Base drafts** were created and approved during the week. When Lira encounters a question it can't answer well, it creates a Knowledge Base draft suggesting what content should be added. Reviewing and approving these drafts (in **Support → Knowledge** or **Knowledge Base → Documents**) directly improves future response quality.

---

## Using analytics to improve performance

**If autonomous rate is low:**
- Your Knowledge Base may be sparse — add more documents and connected sources
- Your confidence threshold may be too high — try lowering it from Settings → Behaviour
- Check top intents to find which topics Lira is struggling with

**If CSAT is low:**
- Read the conversations where customers rated 1–2 stars
- Identify what Lira said that didn't help
- Add or update the relevant content in your Knowledge Base
- Check if force-escalate intents should catch those types of questions earlier

**If escalations are high:**
- Same diagnosis as low autonomous rate — usually a Knowledge Base gap
- Check if any specific intent is driving escalations disproportionately (visible in Top Intents)

**If first response time is slow:**
- For email: this is usually latency in email delivery from the customer's provider, not Lira's processing time
- For chat/widget: if response times are above a few seconds, contact support
