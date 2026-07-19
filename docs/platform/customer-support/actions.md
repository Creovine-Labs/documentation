---
sidebar_position: 9
title: Actions
description: Human approval for the AI agent — how capability calls the policy engine routed to your team get reviewed, approved, or rejected.
---

# Actions

Some capability calls Lira's AI agent could not — or should not — run on its own. Those runs pause in a `pending_approval` state until a teammate decides. This is the human-in-the-loop edge of the [Agent Runtime](/platform/customer-support/agent-runtime).

Pending runs are visible in **Settings → Support → Health & audit → Agent audit log** — filter the status to **Pending approval**. Approval and rejection are performed through the admin API (below); the dedicated Actions page that previously lived in the sidebar has been retired in favour of the consolidated audit surface.

---

## When something needs approval

Not every capability call needs your team's attention. Most reads and low-risk writes auto-execute, and many high-stakes operations are confirmed by the customer directly in chat. A run only pauses for approval when the policy engine returns `mode: "human"` for one of two reasons:

- The capability's risk tier is `admin_approve` — e.g. an integration write that you have explicitly chosen to require teammate approval for.
- An admin override raised an existing capability into a tier that requires human approval.

If a call is **blocked outright** (insufficient auth, end-to-end-blocked tier), it never pauses for approval — it is refused and the agent escalates differently. Those records appear in the [audit log](/platform/customer-support/audit) with status `blocked`.

---

## Reviewing a pending run

Each pending run in the audit log shows:

- **Capability** — the resource or action the agent wants to call, e.g. `stripe_cancel_subscription`, `create_linear_issue`.
- **Risk tier** — why this needed approval in the first place.
- **Conversation ID** — link back to the chat that triggered the run.
- **Timestamp** — when the agent requested it.
- **Input summary** — redacted snapshot of the arguments the agent would pass.

### Approving a run

Approving moves the run to `approved`; the runtime executes the capability and the status transitions to `succeeded` or `failed` depending on the outcome. The result is summarised back in the chat for the customer.

```http
POST /lira/v1/support/actions/orgs/:orgId/:actionId/approve
Authorization: Bearer <admin-jwt>
```

### Rejecting a run

Rejecting moves the run to `cancelled` and it is never executed. The agent receives a signal that it should pursue a different path — typically by escalating the conversation to a teammate.

```http
POST /lira/v1/support/actions/orgs/:orgId/:actionId/reject
Authorization: Bearer <admin-jwt>
```

Both endpoints require **Owner** or **Admin** role on the org.

---

## Action statuses explained

| Status | Meaning |
|---|---|
| `requested` | The agent asked, the engine has not finished evaluating. Rarely visible. |
| `pending_approval` | Waiting for your team to approve or reject. |
| `approved` | Your team approved; the runtime is about to execute. |
| `running` | The executor is in flight. |
| `succeeded` | Completed successfully. |
| `failed` | The executor threw. The error is in the run's output summary. |
| `cancelled` | A teammate rejected, or the customer declined an in-chat confirmation. |

Runs blocked by policy (insufficient auth, blocked tier) appear in the [audit log](/platform/customer-support/audit) with status `blocked` and never enter the approval flow.

---

## Tips

**Tighten the policy instead of approving the same kind of run twice.** If you find yourself rubber-stamping the same capability call every day, the right move is to lower its risk tier in [Capabilities](/platform/customer-support/capabilities). The agent will then handle it autonomously and only the unusual cases come to you.

**Use the audit log to spot patterns.** Frequent `failed` runs for the same capability often point at an expired integration credential or a schema mismatch — neither of which approval can fix. The error message on the audit record points you at the cause.

**A rejected run does not silence the conversation.** The chat stays open. Reply directly to the customer, or hand the conversation off to a teammate from the Tickets queue if they need to act outside Lira.
