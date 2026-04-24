---
sidebar_position: 5
title: Actions
description: Review and approve autonomous actions Lira wants to take on behalf of customers — the approval queue, history, and action types.
---

# Actions

The Actions tab is where you review and approve things Lira wants to do on behalf of a customer. These aren't just answers — they're actual operations: updating an account, issuing a refund, modifying a subscription, creating a record in a connected system.

Navigate to **Support → Actions**.

---

## What are autonomous actions?

When Lira resolves a support request, it sometimes determines that the best response isn't just an answer — it's performing an action. Examples:

- Cancelling a subscription on request
- Updating billing details
- Creating a bug report in Linear
- Updating a contact record in HubSpot
- Issuing a refund via an integrated payment system

Because actions have real-world consequences, Lira doesn't execute them automatically by default. It proposes them and waits for your team to **approve** or **reject**.

This keeps your team in control of consequential decisions while still letting Lira handle the diagnostic and communication work.

---

## Approval Queue

The **Approval Queue** tab shows all pending actions waiting for your review. A red badge on the tab indicates how many actions are waiting.

Each action card shows:

- **Action type** — a human-readable description of what Lira wants to do (e.g. `create linear issue`, `update contact`)
- **Status badge** — Pending (amber), Approved (blue), Executed (green), Failed (red), Rejected (gray)
- **Conversation ID** — the support conversation that triggered this action
- **Timestamp** — when the action was proposed
- **Error message** (if the status is Failed) — what went wrong during execution

### Approving an action

Click **Approve** (green button) on an action card. Lira will execute the action immediately — for example, creating a Linear issue or updating the HubSpot record — and the status changes to **Executed**.

### Rejecting an action

Click **Reject** (red button). The action is cancelled and logged in history with a **Rejected** status. Lira will not re-propose the same action automatically; the conversation remains open in the Inbox for your team to handle manually if needed.

---

## History

The **History** tab shows a complete log of all actions — pending, approved, executed, failed, and rejected. This gives your team a full audit trail of every autonomous action Lira has proposed.

You can use history to:

- Audit what Lira has done on behalf of customers
- Investigate a failed action (the error message shows what went wrong)
- Understand patterns — if the same action type appears frequently, it may be worth automating it or improving the underlying integration

---

## Action statuses explained

| Status | Meaning |
|--------|---------|
| **Pending** | Proposed by Lira, waiting for your approval or rejection |
| **Approved** | Your team approved it — Lira is executing it |
| **Executed** | Successfully completed |
| **Failed** | Execution attempted but encountered an error (see error message) |
| **Rejected** | Your team rejected it — no action taken |

---

## Tips

**Process pending actions daily** — if your organisation is handling many conversations, the approval queue can grow. Set a routine to check it at the start of each work day.

**Review failed actions** — a failed action often means an integration configuration issue (missing permissions, expired credentials, etc.). The error message on the action card will point you in the right direction.

**If an action was rejected by mistake** — the conversation is still open in the Inbox. Reply to the customer directly and take the action manually through the relevant integration.
