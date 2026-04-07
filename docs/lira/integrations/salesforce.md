---
sidebar_position: 9
title: Salesforce
description: CRM integration with OAuth2 + PKCE for contacts, accounts, and opportunities.
---

# Salesforce Integration

Connect Lira to **Salesforce** via OAuth2 with PKCE for contact management, account tracking, and opportunity pipeline integration.

## Setup

1. Navigate to **Settings → Integrations → Salesforce**
2. Click **Connect** — redirects to Salesforce OAuth consent (with PKCE)
3. Authorize the Lira app
4. Configure member mappings

## Capabilities

| Feature | Description |
|:---|:---|
| **Contacts** | List and view contact records |
| **Accounts** | List and view account records |
| **Opportunities** | Track opportunities and stages |
| **Leads** | List and manage leads |

## Sales Coaching Integration

During sales calls, Salesforce integration provides the same capabilities as HubSpot:

- **Pre-call context** — Load prospect details and opportunity data
- **Auto-fill** — Push call notes and next steps to Salesforce records
- **Pipeline updates** — Update opportunity stages based on call outcomes

## OAuth Configuration

| Variable | Description |
|:---|:---|
| `SALESFORCE_CLIENT_ID` | Salesforce Connected App client ID |
| `SALESFORCE_CLIENT_SECRET` | Salesforce Connected App client secret |

Salesforce uses **OAuth2 + PKCE** for enhanced security — the authorization code flow includes a code verifier/challenge pair.
