---
sidebar_position: 7
title: Capabilities
description: Manage the catalog of resources and actions Lira's AI agent is allowed to call for your org — review built-ins, register server-side capabilities, and tighten policy without writing code.
---

# Capabilities

The **Capabilities** catalog is the admin view of everything Lira's AI agent can call inside your org. Each row is a single resource or action with a description, a risk tier, an auth scope, and a clear executable / metadata-only badge.

Navigate to **Settings → Support → AI behavior → Capabilities**. The surface is restricted to **Owner** and **Admin** roles.

If you are new to the capability model, start with the [Agent Runtime overview](/platform/customer-support/agent-runtime).

---

## What you see on the page

Each capability card shows:

| Field | Meaning |
|---|---|
| **Name** | The stable identifier the agent uses internally (e.g. `lira_create_support_ticket`). |
| **Display name** | A human label you can edit. Optional. |
| **Description** | One paragraph the agent reads when it is deciding whether to call this capability. Be precise — the agent will not call something whose description doesn't match the situation. |
| **Kind** | `resource` (read) or `action` (write). |
| **Risk** | One of the seven [risk tiers](/platform/customer-support/agent-runtime#risk-tiers). |
| **Auth scope** | The minimum visitor identity required: `public`, `verified_visitor`, or `verified_customer`. |
| **Source** | Where the capability came from: `built_in`, `connector`, `sdk`, or `server_side`. |
| **Status badge** | `runtime executable` — wired to real code and callable today. **`metadata only`** — registered but no executor exists yet, so the agent does not see it as callable. |

A capability stays `metadata only` until either a built-in matches its name or a server-side connector is in place. This is intentional — a half-registered action should never look real to the agent.

---

## What you can change

For any capability that maps to a known runtime tool, an admin can override:

- The **description** (this is what the agent reads).
- The **input schema** and **output schema**.
- The **kind**, **risk tier**, and **auth scope**.
- The **enabled** flag (disable a tool entirely for your org).

The override applies on the next agent turn — there is no deploy step.

### Tightening policy

This is the common case. You decide that a built-in tool is too permissive for your business and want to require more before the agent runs it.

Examples of valid tightenings:

- `lira_create_support_ticket` from `safe_write` → `customer_confirm`. The agent now has to ask the customer before opening a ticket.
- `stripe_cancel_subscription` from `verified_customer` → also requires `admin_approve`. The action is queued for teammate approval instead of running directly (see [Actions](/platform/customer-support/actions)).
- `get_customer_profile` from `verified_visitor` → `verified_customer`. Anonymous visitors can no longer trigger it even with a signed identity.

### What you cannot do

Overrides may only **tighten** policy, never **loosen** it. The runtime refuses any save that tries to lower the risk tier or weaken the auth scope vs the built-in defaults. The two errors you will see are:

- `RISK_LOOSENED` — your `risk` choice is below the built-in's risk tier.
- `SCOPE_LOOSENED` — your `auth_scope` choice is below the built-in's auth scope.

Both are surfaced as a 400 from the admin API and as an inline form error in the dashboard. This is a deliberate one-way ratchet: a single misconfigured row should never silently widen what an anonymous visitor can reach.

### Disabling a capability

Toggle **enabled** off. The runtime hides the capability from the model on the next conversation. Existing audit records are preserved; only future calls are affected.

Disable is useful when:

- A pack ships with a tool you do not want the agent to use at all (e.g. you don't want it to cancel subscriptions, only to look them up).
- A connected integration is degraded and you'd rather the agent escalate to a human while you fix it.
- You are running an A/B test on what the agent has access to.

---

## Registering a server-side capability

You can register a capability that does not exist as a built-in. In v1 this is **metadata-only** — the capability appears in the catalog with the `metadata only` badge and the agent does not call it until a real executor is attached on Lira's side.

This is the right way to:

- Communicate to your team that "this is an action we plan to expose, with this risk and auth shape" before any code exists.
- Reserve a name so the future executor inherits the policy you already chose.
- Document policy expectations in the same place as the rest of your support config.

Custom HTTP connectors are explicitly deferred to v2.

### Via the admin API

```http
PUT /lira/v1/support/agent-runtime/orgs/:orgId/capabilities
Authorization: Bearer <admin-jwt>
Content-Type: application/json

{
  "name": "billing.retry_payment",
  "display_name": "Retry failed payment",
  "description": "Retry the most recent failed invoice for the verified customer.",
  "kind": "action",
  "auth_scope": "verified_customer",
  "risk": "customer_confirm",
  "input_schema": {
    "type": "object",
    "properties": {
      "invoice_id": { "type": "string" }
    },
    "required": ["invoice_id"]
  }
}
```

Response: `200 OK` with the persisted capability, decorated with `executable: false` since no built-in or connector matches `billing.retry_payment` yet.

---

## Admin API reference

All endpoints require **Owner** or **Admin** role on the org. The runtime applies the same monotonic-tightening rule on every write.

### List capabilities

```http
GET /lira/v1/support/agent-runtime/orgs/:orgId/capabilities
```

Returns:

```json
{
  "capabilities": [
    {
      "capability_id": "...",
      "name": "lira_create_support_ticket",
      "description": "Open a support ticket on behalf of the customer.",
      "kind": "action",
      "source": "server_side",
      "enabled": true,
      "auth_scope": "verified_visitor",
      "risk": "safe_write",
      "executable": true,
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

### Upsert a capability

```http
PUT /lira/v1/support/agent-runtime/orgs/:orgId/capabilities
```

Body matches the capability shape above. If `capability_id` is omitted, a new one is generated. Errors are returned with a stable code:

| Code | Meaning |
|---|---|
| `RISK_LOOSENED` | The risk tier is less strict than the built-in default. |
| `SCOPE_LOOSENED` | The auth scope is less strict than the built-in default. |
| `VALIDATION_ERROR` | The body did not match the expected schema. |
| `INSUFFICIENT_ROLE` | The caller is not an org admin. |

### Delete a capability

```http
DELETE /lira/v1/support/agent-runtime/orgs/:orgId/capabilities/:capabilityId
```

Removes the override. Built-in defaults are restored on the next conversation.

---

## Related

- [Agent Runtime overview](/platform/customer-support/agent-runtime) — capability model, risk tiers, policy engine.
- [Audit](/platform/customer-support/audit) — what every capability call looks like once it has run.
- [Actions](/platform/customer-support/actions) — how runs the policy engine routed to a teammate get approved.
