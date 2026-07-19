---
sidebar_position: 8
title: Audit
description: Every action Lira's AI agent runs is recorded as an AgentActionRun — what was requested, what the policy engine decided, redacted inputs and outputs, and estimated cost. Filter, paginate, and read it from the dashboard or the admin API.
---

# Audit

The **Agent audit log** is the system-of-record for everything Lira's AI agent did inside your org. Every capability call — whether it ran autonomously, asked the customer, waited for a teammate, or was refused outright — leaves one **AgentActionRun** record.

Navigate to **Settings → Support → Health & audit → Agent audit log**. The surface is restricted to **Owner** and **Admin** roles because the records carry redacted PII summaries and policy decisions.

If you're not sure how the runtime decides what to call in the first place, start with [Agent Runtime](/platform/customer-support/agent-runtime).

---

## What's in an action run

Every record captures:

| Field | Meaning |
|---|---|
| **Capability** | The tool the agent tried to call (e.g. `lira_create_support_ticket`, `stripe_get_customer`). |
| **Kind** | `resource` (read) or `action` (write). |
| **Status** | The lifecycle state (see the table below). |
| **Risk tier** | The capability's risk tier at the moment of the call (after any admin overrides). |
| **Required scope** / **Effective scope** | What the visitor needed to be, and what they actually were. |
| **Policy decision** | The full decision object: `mode`, `reason`, whether legacy HITL was involved. |
| **Input summary** | A redacted snapshot of the arguments the agent passed. |
| **Output summary** | A redacted snapshot of the result. If the call failed, the error message instead. |
| **Conversation / Visitor / Ticket IDs** | Links back to the chat, the customer, and any ticket created. |
| **Estimated tokens in / out** | Model tokens attributed to this run. |
| **Estimated model cost** | The dollar cost computed from those tokens. |

Tokens and cost are attributed per agent turn. If a single turn fires three tool calls, each one carries an even share of that turn's output cost.

---

## Run statuses

| Status | What happened |
|---|---|
| `requested` | The agent asked to call the capability; the engine has not finished evaluating yet. |
| `blocked` | The policy engine refused — typically because the auth scope was insufficient or the risk tier is currently end-to-end blocked (`step_up`, `admin_approve`, `human_only` on policies that route those to humans). |
| `pending_approval` | The capability needs a human. The run is queued for teammate review — see [Actions](/platform/customer-support/actions) for how approval works. |
| `approved` | A teammate approved the run; execution is about to start. |
| `running` | The executor is in flight. |
| `succeeded` | The capability returned successfully. |
| `failed` | The executor threw. The error is in the output summary. |
| `cancelled` | A teammate rejected the run, or the customer declined the in-chat confirmation. |

---

## Filtering

The dashboard supports two filters today:

- **Status** — restrict to one of the statuses above (Pending approval, Running, Succeeded, Failed, Cancelled).
- **Capability** — type the capability name (e.g. `stripe_cancel_subscription`).

The admin API additionally supports a **time range** (ISO timestamps `from` and `to`). Filters compose, and the page shows at-a-glance metrics over the currently visible window, including estimated model cost.

---

## PII redaction

Audit records are designed to be safe for admins to read. Before a record is persisted:

- Email addresses are masked, e.g. `a***@example.com`.
- Fields whose names look like secrets (`password`, `token`, `api_key`, `secret`, `authorization`, ...) are removed at any depth in the input or output.
- Nested objects and arrays are walked recursively up to a safe depth.

This applies uniformly to **every** capability — built-in, pack, SDK, server-side. The agent never sees the raw values either; what is shown to the customer is what is summarised here.

---

## Admin API

The dashboard reads from these endpoints. Both require **Owner** or **Admin** role on the org.

### List action runs

```http
GET /lira/v1/support/actions/orgs/:orgId/agent-runs
  ?status=blocked
  &capability=stripe_cancel_subscription
  &from=2026-05-01T00:00:00Z
  &to=2026-05-31T23:59:59Z
  &limit=50
  &cursor=<opaque-string-from-previous-response>
```

Response:

```json
{
  "action_runs": [
    {
      "run_id": "...",
      "capability_name": "stripe_cancel_subscription",
      "capability_kind": "action",
      "status": "pending_approval",
      "risk": "customer_confirm",
      "auth_scope": "verified_customer",
      "policy_decision": {
        "allowed": true,
        "mode": "confirm",
        "risk": "customer_confirm",
        "required_scope": "verified_customer",
        "effective_scope": "verified_customer",
        "reason": "customer_confirm tier — needs in-chat approval"
      },
      "input_summary": { "...": "..." },
      "output_summary": null,
      "estimated_tokens_in": 184,
      "estimated_tokens_out": 92,
      "estimated_model_cost_usd": 0.0021,
      "conv_id": "...",
      "ticket_id": null,
      "created_at": "..."
    }
  ],
  "next_cursor": "..."
}
```

`next_cursor` is opaque. Pass it back on the next request to get the next page. When the server returns `next_cursor: null`, you have reached the end. Page size is capped at 100; the server may walk several internal pages per request to satisfy heavy filters, but the response will never exceed the limit you set.

### Get one action run

```http
GET /lira/v1/support/actions/orgs/:orgId/agent-runs/:runId
```

Returns the same record shape under `{ "action_run": { ... } }`, or `404` if the run does not exist or does not belong to this org.

---

## Related

- [Agent Runtime overview](/platform/customer-support/agent-runtime) — the model behind these records.
- [Capabilities](/platform/customer-support/capabilities) — change a capability's risk or scope to influence what shows up here.
- [Actions](/platform/customer-support/actions) — how runs in `pending_approval` state get approved or rejected.
