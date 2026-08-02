---
slug: /platform/customer-support/roles
sidebar_position: 15
title: Roles & permissions
description: What owners, admins and members can each do — and what is deliberately not customer-settable.
---

# Roles & permissions

Every person in an organization holds one of three roles. Roles are per organization: the same person can be an admin in one org and a member in another, and switches between them in the org switcher.

## The three roles

| Capability | Owner | Admin | Member |
| --- | :---: | :---: | :---: |
| Read tickets, conversations and knowledge | ✅ | ✅ | ✅ |
| Reply to customers, work and resolve tickets | ✅ | ✅ | ✅ |
| Manage knowledge sources (crawl, upload, connect) | ✅ | ✅ | — |
| Change support configuration (channels, behavior, escalation, SLA) | ✅ | ✅ | — |
| Create and revoke API keys | ✅ | ✅ | — |
| Connect and approve MCP tools | ✅ | ✅ | — |
| Invite and remove teammates | ✅ | ✅ | — |
| Change a teammate's role | ✅ | — | — |
| Transfer ownership | ✅ | — | — |
| Manage billing and change plan | ✅ | — | — |

Every organization has exactly one owner — the person who created it, or whoever ownership was last transferred to.

## Rules the platform enforces

- **You cannot change your own role.** An admin cannot promote themselves; an owner cannot demote themselves.
- **You cannot assign the owner role.** Ownership moves only through an explicit transfer, so an organization is never left with two owners or none.
- **Ownership can only transfer to an existing member.** Invite the person first.

## Seats

Seats are unlimited on every plan, including Free. Adding teammates never changes your bill — only conversation volume does. See [Subscription & Billing](/getting-started/plans-and-billing).

## Not customer-settable

Some values are deliberately outside role permissions, because setting them wrong would be unsafe or would remove a commercial guardrail:

- **Monthly conversation and AI-reply limits.** These are derived from your plan. If an organization could set its own ceiling — especially to "unlimited" — it could drive unbounded model cost. Plan changes go through billing.
- **Platform-owned configuration** on Lira-operated demo organizations.

## Not supported yet

- **No custom roles or granular permission sets.** Three fixed roles only.
- **No SSO or SAML** except on Enterprise. **No SCIM provisioning** — teammates are invited by email.

## Related

- [Get an Account](/getting-started/get-an-account) — creating an org and inviting your team
- [Authentication](/getting-started/authentication)
- [Security & actions governance](/platform/customer-support/security)
