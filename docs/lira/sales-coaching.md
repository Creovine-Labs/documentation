---
sidebar_position: 5
title: Sales Coaching
description: Real-time AI sales coaching during calls.
---

# Sales Coaching

Real-time AI coaching during sales calls — transcription, objection handling, battle cards, and CRM auto-fill.

## How It Works

Lira joins the sales call using the same bot deployment mechanism as meetings. During the call:

1. **Real-time transcription** — every speaker attributed by name
2. **Objection detection** — AI identifies customer objections and surfaces suggested responses
3. **Battle cards** — relevant competitive intelligence shown based on conversation context
4. **CRM auto-fill** — call notes, key insights, and next steps pushed to HubSpot or Salesforce

## CRM Integration

Sales coaching integrates with:

| CRM | Capabilities |
|:---|:---|
| **HubSpot** | Contacts, companies, deals, pipelines, notes |
| **Salesforce** | Contacts, accounts, opportunities, leads |

CRM data is automatically loaded before the call starts, giving Lira context about the prospect, deal stage, and previous interactions.

## Organization Knowledge Base

Lira uses the org's knowledge base (website crawl + uploaded documents) to ground responses in your company's actual products, pricing, and competitive positioning. See [Organization Context](/lira/architecture/organization-context) for details.

## Deployment

Deploy Lira to a sales call the same way as a regular meeting:

```bash
POST /lira/v1/bot/deploy
Authorization: Bearer <jwt>

{
  "meetingUrl": "https://meet.google.com/abc-defg-hij",
  "orgId": "your-org-id",
  "settings": {
    "personality": "supportive",
    "mode": "sales_coaching"
  }
}
```
