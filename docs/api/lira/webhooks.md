---
sidebar_position: 9
title: Webhooks
description: Lira inbound webhook endpoints for Linear, Slack, and Teams.
---

# Webhooks API

**Base URL:** `https://api.creovine.com/lira/v1/webhooks`

These endpoints receive inbound events from connected third-party platforms.

## Linear Webhook

```http
POST /lira/v1/webhooks/inbound/linear
```

Receives Linear webhook events (issue created, updated, etc.). Configure the webhook URL in your Linear workspace settings.

## Slack Events

```http
POST /lira/v1/webhooks/inbound/slack
```

Handles Slack Events API events (messages, reactions, etc.). Verified using `SLACK_SIGNING_SECRET`.

## Microsoft Teams Webhook

```http
POST /lira/v1/webhooks/inbound/teams
```

Receives Microsoft Teams activity notifications.

## Webhook Security

| Provider | Verification Method |
|:---|:---|
| Linear | Webhook signature header |
| Slack | `SLACK_SIGNING_SECRET` — HMAC-SHA256 request signing |
| Microsoft Teams | Azure Bot Framework token validation |
| SES/SNS (Email) | SNS message signature verification |
