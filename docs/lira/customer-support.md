---
sidebar_position: 6
title: Customer Support
description: AI-powered email support with knowledge base–grounded responses.
---

# Customer Support

AI-powered email support — inbound customer emails are processed with full org knowledge base context, generating intelligent replies or escalating to your team.

## How It Works

Customer Support AI reuses the same email architecture as Lira's inbound reply engine:

1. Configure a **custom support domain** (e.g. `support@yourcompany.com`) via the Resend domain API
2. Inbound emails are captured by **AWS SES** → stored in S3 → published to **SNS**
3. SNS triggers `POST /lira/v1/email/inbound`
4. Backend decodes the JWT reply token, loads thread history, runs **Qdrant vector search** against the org knowledge base
5. **GPT-4o-mini** generates a grounded response or escalates to an org admin

## Email Configuration

```bash
# Register custom sending domain
POST /lira/v1/email/domain
Authorization: Bearer <jwt>

{
  "domain": "yourcompany.com"
}

# Check domain verification status
GET /lira/v1/email/domain/status

# Update email config (AI reply toggle, notification prefs)
PUT /lira/v1/email/config
{
  "aiReplyEnabled": true,
  "escalationEmail": "team@yourcompany.com"
}
```

## Thread Management

```bash
# List all email threads
GET /lira/v1/email/threads

# Get thread with full message history
GET /lira/v1/email/threads/:threadId
```

## Knowledge Base Grounding

AI replies are grounded in your organization's knowledge base:

- **Website crawl** — Crawlee scrapes your org's website; pages are summarised and embedded in Qdrant
- **Document uploads** — PDFs and DOCX files are parsed, chunked, and embedded

Before generating a reply, the system performs a vector search to find the most relevant knowledge base entries, injecting them into the system prompt for accurate, contextual responses.

## Escalation

When the AI cannot confidently answer a customer query (low relevance scores from vector search), it automatically escalates to the configured escalation email address with the full thread context.
