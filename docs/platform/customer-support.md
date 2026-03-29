---
slug: /platform/customer-support
sidebar_position: 4
title: Customer Support
---

# Customer Support AI

AI-powered email support with custom domain management, knowledge base–grounded responses, and automatic escalation.

## Overview

Lira handles inbound customer support emails autonomously:

1. Customer emails your support address (e.g., `support@yourdomain.com`)
2. Lira reads the email in context
3. Searches your organization's knowledge base for relevant information
4. Generates a response grounded in your docs and policies
5. If confidence is low → escalates to a human admin

## Key Features

### Custom Email Domain

Set up a custom support email domain for your organization:

- Connect your domain via DNS records
- Lira sends and receives from your domain (e.g., `lira@yourdomain.com`)
- Professional appearance — customers see your brand, not Lira's

### Knowledge Base Grounding

Every AI response is grounded in your organization's knowledge base:

- Website crawl content
- Uploaded documents (PDFs, DOCX)
- Vector search finds the most relevant passages
- Responses cite sources when appropriate

### Thread Management

Lira maintains conversation threads:

- Tracks the full email thread history
- Understands context from previous messages
- Handles follow-up questions without repeating information

### Automatic Escalation

When Lira can't confidently answer:

- Flags the ticket for human review
- Notifies admins via email or Slack
- Preserves the full thread context for the human agent

### Reply Engine

The inbound reply engine handles customer responses:

```
Customer replies to Lira's email
  → AWS SES receives the email
  → SNS notification triggers webhook
  → Lira parses the reply, extracts context
  → Searches knowledge base for relevant info
  → Decides: respond directly or escalate
```

## Email Domain Setup

1. Navigate to **Organization Settings → Email**
2. Add your custom domain
3. Configure DNS records (MX, SPF, DKIM)
4. Verify domain ownership
5. Set the default support email address

Lira supports two sending modes:

| Mode | From Address | Setup |
|:---|:---|:---|
| **Platform** | `noreply@liraintelligence.com` | No setup needed |
| **Custom Domain** | `lira@yourdomain.com` | DNS verification required |
