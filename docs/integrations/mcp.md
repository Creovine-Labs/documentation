---
slug: /integrations/mcp
sidebar_position: 9
title: MCP server
description: Connect your own Model Context Protocol (MCP) server so Lira can take real, governed actions under your own auth.
---

# Connect your MCP server

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is the standard way for AI applications to connect to external tools. If you run an MCP server, Lira can import your tools and let the AI use them during support — checking a transaction, freezing a card, scheduling a callback — while every call runs under **your own authentication**.

This is the recommended path for connecting a mature product. The [REST tool pack](/integrations/overview) is the simpler alternative for basic APIs.

## How Lira keeps it safe

Lira never lets the model call your server directly. Each tool you approve becomes a normal Lira agent tool and still passes the full runtime before it can run:

- **Nothing runs until an admin approves it** — discovery only lists your tools, it does not enable them.
- You **map each tool** to a risk level (read, confirm-first, re-auth required, or human-only) and who can use it (anyone, verified visitor, or verified customer).
- Money- and account-adjacent tools can require the customer to **re-authenticate (step-up)** before the action runs.
- The **verified customer identity** is sent to your server out-of-band, so the AI cannot impersonate a different customer through the tool inputs.
- Your **bearer credential is stored encrypted** and sent only to your endpoint; it is never shown back in the dashboard.
- Every call is **logged and metered**, and the whole server can be disabled or disconnected instantly.

## Set it up

1. Open **Settings → Support → Actions**.
2. Under **MCP server**, choose **Connect** and enter your endpoint URL and bearer token. In production the endpoint must be HTTPS and cannot point at a private/internal address.
3. Connecting saves the server **disabled** — nothing is live yet.
4. Choose **Discover tools** to load your tool list. Descriptions are sanitized on import.
5. For each tool, pick a **risk level** and **audience**, then **Approve**. Approve only the tools you want the AI to use.
6. When you are ready, **Enable** the server. You can toggle individual tools or disable everything at any time.

You can also do all of this from the [CLI or API](/integrations/developer-api) instead of the dashboard.

## Requirements for your server

- A streamable HTTP MCP endpoint that implements `initialize`, `tools/list`, and `tools/call`.
- Bearer-token auth (OAuth 2.1 support is on the roadmap for production enterprise use).
- Tools that scope actions to the customer in the `io.lira/customer` metadata Lira passes on each call — **not** to values in the tool arguments.
- Strict input schemas on each tool so inputs are validated on your side too.

## Risk levels

| Risk | What it means |
|---|---|
| Public read | Anyone can trigger. No account data. |
| Private read | Reads account data. Needs a verified customer. |
| Safe write | Low-risk change. Runs without a confirm prompt. |
| Write — confirm first | Asks the customer to confirm before running. |
| Sensitive — re-auth | Money/card-adjacent. Requires step-up re-authentication. |
| Admin approval | Queued for a human admin to approve. |
| Human only | The AI can never run this — humans only. |

## Plan availability

MCP actions follow your plan: **read-only** tools on Pro, and the **full approved set** on Scale and Enterprise. This keeps action-taking aligned with the tier your organization is on.
