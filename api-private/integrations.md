---
slug: /api/integrations
sidebar_position: 7
title: Integrations API
---

# Integrations API

Manage third-party integration connections per organization. All routes are under `/lira/v1/integrations` and require JWT authentication (except OAuth callbacks).

## Supported Providers

| Provider | Auth Method | Auto Member Mapping |
|:---|:---|:---|
| Linear | OAuth | Yes (by email) |
| Slack | OAuth | Yes (by email) |
| Microsoft Teams | OAuth | Yes (by email) |
| GitHub | OAuth | No |
| Google (Calendar + Drive) | OAuth | No |
| HubSpot | OAuth | No |
| Salesforce | OAuth (PKCE) | No |
| Greenhouse | API Key | No |

## Common OAuth Flow

All OAuth-based integrations follow the same pattern:

### 1. Initiate OAuth

#### `GET /lira/v1/integrations/{provider}/auth?orgId=<orgId>`

Redirects the user to the provider's OAuth consent screen. After authorization, the user is redirected back to the callback URL.

```bash
# Opens in browser — redirects to provider
GET https://api.creovine.com/lira/v1/integrations/slack/auth?orgId=org_xyz
```

### 2. OAuth Callback

#### `GET /lira/v1/integrations/{provider}/callback`

Handles the OAuth callback. Exchanges the authorization code for tokens, encrypts them with KMS, and stores them in DynamoDB. Redirects back to the app.

### 3. Check Status

#### `GET /lira/v1/integrations/{provider}/status?orgId=<orgId>`

```bash
curl "https://api.creovine.com/lira/v1/integrations/slack/status?orgId=org_xyz" \
  -H "Authorization: Bearer <token>"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "connected": true,
    "provider": "slack",
    "connected_at": "2026-03-01T10:00:00Z"
  }
}
```

### 4. Disconnect

#### `DELETE /lira/v1/integrations/{provider}?orgId=<orgId>`

Disconnect the integration and revoke stored tokens.

## API Key Flow (Greenhouse)

### `POST /lira/v1/integrations/greenhouse/connect?orgId=<orgId>`

```json
{ "apiKey": "gh_harvest_key_..." }
```

Validates the API key against the Greenhouse API before saving.

---

## Token Management

Each provider handles token refresh differently:

| Provider | Strategy |
|:---|:---|
| Linear | Manual refresh |
| Slack | No-expiry bot tokens |
| Microsoft Teams | Auto-refresh on expiry |
| Google | Auto-refresh on expiry |
| HubSpot | Refresh if within 5 min of expiry |
| Salesforce | Refresh with PKCE |

---

## Provider-Specific Endpoints

### Linear

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/linear/teams?orgId=` | List teams |
| `PUT` | `/linear/team?orgId=` | Set default team |
| `GET` | `/linear/members?orgId=` | List members |
| `GET` | `/linear/member-map?orgId=` | Get member mappings |
| `PUT` | `/linear/member-map?orgId=` | Save member mappings |

### Slack

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/slack/channels?orgId=` | List channels |
| `PUT` | `/slack/channel?orgId=` | Set default channel |
| `GET` | `/slack/members?orgId=` | List members |
| `GET` | `/slack/member-map?orgId=` | Get member mappings |
| `PUT` | `/slack/member-map?orgId=` | Save member mappings |

### Microsoft Teams

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/teams/teams?orgId=` | List teams |
| `GET` | `/teams/channels?orgId=` | List channels |
| `PUT` | `/teams/team?orgId=` | Set default team |
| `PUT` | `/teams/channel?orgId=` | Set default channel |
| `GET` | `/teams/members?orgId=` | List members |
| `GET` | `/teams/member-map?orgId=` | Get member mappings |
| `PUT` | `/teams/member-map?orgId=` | Save member mappings |

### GitHub

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/github/repos?orgId=` | List repositories |
| `GET` | `/github/repos/:owner/:repo/branches` | List branches |
| `GET` | `/github/repos/:owner/:repo/files` | List files |
| `GET` | `/github/repos/:owner/:repo/file` | Read file content |
| `POST` | `/github/repos/:owner/:repo/files` | Create or update a file |
| `POST` | `/github/repos/:owner/:repo/branches` | Create a branch |
| `GET` | `/github/repos/:owner/:repo/issues` | List issues |
| `POST` | `/github/repos/:owner/:repo/issues` | Create an issue |
| `GET` | `/github/repos/:owner/:repo/pulls` | List pull requests |
| `POST` | `/github/repos/:owner/:repo/pulls` | Create a pull request |
| `GET` | `/github/repos/:owner/:repo/search` | Search code |

### Google (Calendar + Drive)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/google/calendars?orgId=` | List calendars |
| `PUT` | `/google/calendar?orgId=` | Set default calendar |
| `GET` | `/google/events?orgId=` | List calendar events |
| `POST` | `/google/events?orgId=` | Create a calendar event |
| `PUT` | `/google/events/:eventId?orgId=` | Update event |
| `GET` | `/google/folders?orgId=` | List Drive folders |
| `PUT` | `/google/folder?orgId=` | Set default folder |
| `POST` | `/google/folders?orgId=` | Create a folder |
| `GET` | `/google/files?orgId=` | List Drive files |
| `GET` | `/google/files/search?orgId=` | Search files |
| `GET` | `/google/files/:fileId?orgId=` | Get file metadata |
| `GET` | `/google/files/:fileId/content?orgId=` | Read file content |
| `GET` | `/google/sheets/:spreadsheetId?orgId=` | Read spreadsheet data |
| `GET` | `/google/docs/:documentId?orgId=` | Read Google Doc content |

### Greenhouse

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/greenhouse/jobs?orgId=` | List jobs |
| `GET` | `/greenhouse/jobs/:jobId/stages?orgId=` | List job stages |
| `GET` | `/greenhouse/candidates?orgId=` | List candidates |
| `GET` | `/greenhouse/applications?orgId=` | List applications |
| `GET` | `/greenhouse/scorecards/:appId?orgId=` | Get scorecards |
| `GET` | `/greenhouse/offers?orgId=` | List offers |
| `GET` | `/greenhouse/users?orgId=` | List users |

### HubSpot

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/hubspot/contacts?orgId=` | List contacts |
| `GET` | `/hubspot/companies?orgId=` | List companies |
| `GET` | `/hubspot/deals?orgId=` | List deals |
| `GET` | `/hubspot/pipelines?orgId=` | List pipelines |
| `GET` | `/hubspot/owners?orgId=` | List owners |
| `GET` | `/hubspot/notes?orgId=` | List notes |
| `POST` | `/hubspot/notes?orgId=` | Create a note |

### Salesforce

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/salesforce/contacts?orgId=` | List contacts |
| `GET` | `/salesforce/accounts?orgId=` | List accounts |
| `GET` | `/salesforce/opportunities?orgId=` | List opportunities |
| `GET` | `/salesforce/leads?orgId=` | List leads |

---

## Member Mapping

For Linear, Slack, and Teams, Lira automatically maps organization members to external accounts by email during the OAuth callback. You can also manage mappings manually:

```bash
# Get current mappings
curl "https://api.creovine.com/lira/v1/integrations/slack/member-map?orgId=org_xyz" \
  -H "Authorization: Bearer <token>"

# Save mappings
curl -X PUT "https://api.creovine.com/lira/v1/integrations/slack/member-map?orgId=org_xyz" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mappings": [
      { "member_id": "usr_abc", "external_id": "U0123456789", "external_name": "Sarah Chen" }
    ]
  }'
```
