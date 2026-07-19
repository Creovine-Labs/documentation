---
slug: /getting-started/authentication
sidebar_position: 4
title: Authentication
description: How users sign in, how programmatic clients authenticate, and how integration OAuth scopes are handled.
---

# Authentication

Lira authenticates **dashboard users** with email + password or Google Sign-In, scopes every API call to the user's organization via JWT, and uses **separate OAuth flows per integration** so login-scope and data-scope stay independent.

## Dashboard login

Users sign in two ways:

- **Email + password** — invite-only. Accounts are issued by the Lira team (see [Get an Account](/getting-started/get-an-account)) or by an org admin via a per-employee invite link from the **Members** page. There's no public sign-up button; visit `/login` to sign in.
- **Google Sign-In** — for users whose email already has an account on Lira. Powered by `@react-oauth/google` on the frontend; the backend validates the Google ID token and issues a JWT.

Behind both paths, the backend issues a **7-day JWT** scoped to the user + their organization.

## JWT session

All authenticated API calls include the JWT in the `Authorization` header:

```http
Authorization: Bearer <jwt_token>
```

The token's payload contains:

- `userId` — the user's id
- `tenantId` — their account's tenant (one tenant per email; multiple orgs may live inside a tenant)
- `email`
- `role` — `USER`, `ADMIN`, or `SUPER_ADMIN`

Tokens are validated by `@fastify/jwt` on every request.

## Organization membership

After authentication, API calls are scoped to the user's current organization. The `orgId` is included in the route path:

```http
GET  /lira/v1/orgs/:orgId/members
POST /lira/v1/orgs/:orgId/employee-invites
GET  /lira/v1/orgs/:orgId/tickets
```

A single user may belong to multiple organizations — the dashboard switcher lets them flip between them, and a fresh request inherits the new `orgId`.

## Public widget auth

The chat widget on a customer's website doesn't need a Lira user account. It authenticates **by org id alone** for anonymous visitors, or with a **signed identity blob** (HMAC over `userId`+`email`+expiry, using the org's widget secret) for logged-in visitors.

The widget secret is **server-side only** — never expose it in browser code. See [Identified visitors on the widget page](/platform/customer-support/widget) for the full signing recipe.

## Employee invite tokens

Per-employee invite links (the ones org admins generate on the Members page) carry a 32-char opaque token. The token is one-time, expires after 14 days by default, and only accepts the email it was issued to. When the invitee accepts:

- If their email already has an account in this org's tenant → they're attached to the org as a member; the existing password is unchanged.
- If their email is new in this tenant → they set a name + password on the accept page; a new TenantUser is created, marked email-verified.

In both cases the backend returns a 7-day JWT so the invitee lands signed in.

## Integration OAuth flows

Each third-party integration runs its own OAuth flow with its own client/credentials. Lira uses **two separate Google OAuth client IDs** so logging into the dashboard never requests Drive or Calendar scopes:

| Client ID | Purpose | Scopes |
|---|---|---|
| **Platform Client** | Google Sign-In on the dashboard | `openid`, `email`, `profile` |
| **Integration Client** | Google Drive / Sheets / Docs access | `drive`, `spreadsheets`, etc. |

Per-provider auth methods:

| Provider | Method |
|---|---|
| Google Drive | OAuth 2.0 (integration client) |
| Slack | OAuth V2 |
| Microsoft Teams | Azure AD OAuth |
| GitHub | OAuth App |
| HubSpot | OAuth 2.0 |
| Salesforce | OAuth 2.0 + PKCE |
| Linear | OAuth 2.0 |

See [Integrations](/integrations/overview) for per-provider setup.

## API keys (programmatic clients)

For programmatic access — CI, external automation, server-to-server calls — API keys can be generated from the organization settings. Each key is scoped to a single organization and authorizes the bearer to act as that organization.

Treat keys like passwords. Rotate them via the same panel if a key is ever exposed.
