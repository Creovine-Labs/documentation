---
slug: /api/integrations
sidebar_position: 7
title: Integrations API
---

# Integrations API

Manage third-party integration connections per organization.

## List Connections

### `GET /lira/v1/orgs/:orgId/integrations`

List all integration connections and their status.

**Response:**

```json
{
  "success": true,
  "data": {
    "integrations": [
      {
        "provider": "slack",
        "status": "connected",
        "connectedAt": "2026-03-01T10:00:00Z",
        "scopes": ["chat:write", "channels:read"]
      },
      {
        "provider": "linear",
        "status": "connected",
        "connectedAt": "2026-03-15T14:30:00Z"
      },
      {
        "provider": "github",
        "status": "error",
        "error": "Token expired"
      }
    ]
  }
}
```

## Initiate OAuth

### `GET /lira/v1/orgs/:orgId/integrations/:provider/auth`

Redirects to the provider's OAuth consent screen.

**Supported Providers:** `slack`, `teams`, `google-calendar`, `google-drive`, `linear`, `github`, `hubspot`, `salesforce`

## OAuth Callback

### `GET /lira/v1/integrations/:provider/callback`

Handles the OAuth callback, stores tokens, and redirects back to the app.

## API Key Auth

### `POST /lira/v1/orgs/:orgId/integrations/:provider/key`

For API-key based providers (Greenhouse):

```json
{
  "apiKey": "gh_harvest_key_..."
}
```

## Disconnect

### `DELETE /lira/v1/orgs/:orgId/integrations/:provider`

Disconnect an integration and revoke tokens.

## Member Mapping

### `GET /lira/v1/orgs/:orgId/integrations/:provider/members`

List member mappings between Lira org members and external accounts.

### `PUT /lira/v1/orgs/:orgId/integrations/:provider/members`

Update member mappings:

```json
{
  "mappings": [
    {
      "memberId": "mem_abc",
      "externalId": "U0123456789",
      "externalName": "John Smith"
    }
  ]
}
```
