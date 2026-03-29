---
slug: /getting-started/authentication
sidebar_position: 3
title: Authentication
---

# Authentication

Lira AI uses a dual Google OAuth system — one for platform login, another for integration scopes.

## Platform Login

Users sign in via **Google Sign-In** using `@react-oauth/google` on the frontend. The backend validates the Google ID token and issues a JWT session.

```
Frontend (Google Sign-In) → Google ID Token → Backend /auth/google → JWT
```

### JWT Session

All authenticated API calls include the JWT in the `Authorization` header:

```bash
Authorization: Bearer <jwt_token>
```

The JWT contains the user ID, email, and organization membership. Tokens are validated by `@fastify/jwt` on every request.

## Dual Google OAuth

Lira uses **two separate Google OAuth Client IDs**:

| Client ID | Purpose | Scopes |
|:---|:---|:---|
| **Platform Client** | User login (Sign In with Google) | `openid`, `email`, `profile` |
| **Integration Client** | Google Calendar, Drive, Sheets, Docs access | `calendar`, `drive`, `spreadsheets`, etc. |

This separation ensures that:
- Logging into Lira never requests access to your Google Calendar or Drive
- Integration permissions are granted explicitly when you connect Google services
- Both client IDs are accepted by `getAllowedAudiences()` on the backend

## Organization Membership

After authentication, all API calls are scoped to the user's active organization. The `orgId` is included in route paths:

```
GET /lira/v1/orgs/:orgId/meetings
POST /lira/v1/orgs/:orgId/bot/deploy
```

Users can belong to multiple organizations and switch between them.

## API Keys

For programmatic access (e.g., CI/CD, external automation), API keys can be generated from the organization settings. API keys are scoped to a single organization.

## Integration OAuth Flows

Each third-party integration uses its own OAuth flow:

| Provider | Auth Method |
|:---|:---|
| Google Calendar & Drive | OAuth 2.0 (integration client ID) |
| Slack | OAuth V2 |
| Microsoft Teams | Azure AD OAuth |
| GitHub | OAuth App |
| HubSpot | OAuth 2.0 |
| Salesforce | OAuth 2.0 + PKCE |
| Linear | OAuth 2.0 |
| Greenhouse | API Key |

See [Integrations](/integrations/overview) for detailed setup instructions per provider.
