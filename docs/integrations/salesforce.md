---
slug: /integrations/salesforce
sidebar_position: 9
title: Salesforce
---

# Salesforce Integration

Connect Lira to Salesforce CRM with full OAuth 2.0 + PKCE support for enterprise-grade security.

## Setup

1. Go to **Organization Settings → Integrations → Salesforce**
2. Click **Connect Salesforce**
3. Authorize via Salesforce's OAuth 2.0 + PKCE flow
4. Map members to Salesforce users

## Capabilities

| Feature | Description |
|:---|:---|
| Accounts | Manage account records |
| Contacts | Create and update contacts |
| Opportunities | Track opportunities through stages |
| Leads | Manage lead records and conversion |
| Pipelines | List and manage opportunity pipelines |
| Notes | Log meeting summaries and call notes |
| SOQL | Execute custom queries against Salesforce data |

## Authentication

Salesforce uses **OAuth 2.0 with PKCE** (Proof Key for Code Exchange) via the `jsforce` SDK. This provides enterprise-grade security without requiring a client secret on the frontend.
