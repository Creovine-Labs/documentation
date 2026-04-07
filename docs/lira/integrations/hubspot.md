---
sidebar_position: 8
title: HubSpot
description: CRM integration for contacts, companies, deals, and pipelines.
---

# HubSpot Integration

Connect Lira to **HubSpot** via OAuth2 for contact management, deal tracking, and sales pipeline integration.

## Setup

1. Navigate to **Settings → Integrations → HubSpot**
2. Click **Connect** — redirects to HubSpot OAuth consent
3. Authorize the Lira app
4. Configure member mappings

## Capabilities

| Feature | Description |
|:---|:---|
| **Contacts** | List, create, and update contacts |
| **Companies** | List and view company records |
| **Deals** | Track deal stages and values |
| **Pipelines** | List sales pipelines and stages |
| **Notes** | Create meeting notes on contact/deal records |

## Sales Coaching Integration

During sales calls, HubSpot integration enables:

- **Pre-call context** — Load prospect details, deal stage, and previous interactions before the call starts
- **Auto-fill** — Push call notes, key insights, and next steps to the HubSpot contact/deal record after the call
- **Pipeline updates** — Suggest deal stage changes based on call outcome

## OAuth Configuration

| Variable | Description |
|:---|:---|
| `HUBSPOT_CLIENT_ID` | HubSpot OAuth app client ID |
| `HUBSPOT_CLIENT_SECRET` | HubSpot OAuth app client secret |
