---
slug: /platform/customer-support/mcp
sidebar_position: 9
title: MCP server
description: Connect your own Model Context Protocol (MCP) server so Lira can take real, governed actions under your own auth.
---

# Connect your MCP server

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is the standard way for AI applications to connect to external tools. If you run an MCP server, Lira can import your tools and let the AI use them during support — checking a transaction, freezing a card, scheduling a callback — while every call runs under **your own authentication**.

This is the recommended path for connecting a mature product. The developer API and CLI are the automation layer for teams that want setup to happen from their own backend or terminal.

## Local vs. remote: two ways MCP connects

An MCP server can be reached two ways. The protocol is identical — the same tools, the same `initialize` / `tools/call` calls. Only the **transport** (the "pipe" between the app and the server) is different. This trips people up, so it's worth being clear:

| | **Local (stdio)** | **Remote (HTTP)** — what Lira uses |
|---|---|---|
| How it connects | The app **launches the server as a program on the same computer** and talks to it over stdin/stdout | The app **calls a web address** over the network |
| What you configure | A **command** in a JSON config file (e.g. `npx some-server`) | An **endpoint URL** + a token |
| Where the server runs | On your machine, alongside the app | On a server, always running and reachable |
| Who uses it | Desktop AI tools: **VS Code, Cursor, Claude Desktop** | Cloud services: **Lira**, and other hosted AI products |

If you've added an MCP server in **VS Code or Cursor**, you edited a file like `.vscode/mcp.json` or `~/.cursor/mcp.json` and pasted a **command** — no URL. That works because those editors run *on your computer*, so they can start the server as a local process.

**Lira runs in the cloud.** It can't launch a program on your machine, so it reaches your tools the only way a cloud service can — over the network, at an **HTTPS endpoint URL** with a token. It's the same MCP; it's just reached **remotely instead of locally**.

## What you need

To connect to Lira, your MCP server must be running in **remote (HTTP) mode** and reachable at a public HTTPS URL:

- A **streamable HTTP MCP endpoint** that implements `initialize`, `tools/list`, and `tools/call`.
- Authentication Lira presents on every call — either a **bearer token** or **OAuth 2.1** (see below).

Most MCP servers can run in either mode — running as an HTTP server is usually a flag or a small wrapper. If your tools today only exist as a **local command** (the VS Code style above), your team needs to run that same server in HTTP mode and give it a public URL before Lira can use it.

### Authentication options

| Option | How it works |
|---|---|
| **Bearer token** | You paste a token your server accepts. Simple; good for a private integration. |
| **OAuth 2.1** | Client-credentials flow. You provide a token URL, client ID, client secret, and optional scopes; Lira mints and **auto-refreshes** short-lived access tokens. Recommended for production. |

Credentials are stored encrypted and sent only to your endpoint. OAuth is the more robust choice — Lira never holds a long-lived token, and rotation is automatic.

## The connection fields

In **Settings → Support → Actions → MCP server → Connect**:

| Field | What to put |
|---|---|
| **Label** | Any name you'll recognize this connection by. |
| **Endpoint URL** | The HTTPS address of your MCP server, e.g. `https://mcp.yourcompany.com/mcp`. This comes from **your** server, not from Lira. |
| **Environment** | Sandbox or Production. Defaults to your org's current environment. |
| **Auth** | Bearer token (recommended) or None. |
| **Bearer token** | The token your MCP server accepts. It comes from **your server's** config — Lira does not generate it. Stored encrypted; sent only to your endpoint. |

Connecting validates the URL (an address that isn't a valid HTTPS endpoint is rejected before anything is saved) and turns the server **on** — but the AI still can't do anything until you **approve tools** individually. That per-tool approval is the real gate; the server switch is just a master on/off you can flip any time.

## Set it up

1. Open **Settings → Support → Actions**.
2. Under **MCP server**, choose **Connect** and enter your endpoint URL and bearer token. In production the endpoint must be HTTPS and cannot point at a private/internal address.
3. Connecting turns the server **on** — but nothing is live yet, because no tools are approved.
4. Choose **Discover tools** to load your tool list. Descriptions are sanitized on import.
5. For each tool, pick a **risk level** and **audience**, then **Approve**. Approve only the tools you want the AI to use — this is what actually makes a tool available.
6. You can toggle individual tools, or use the master switch to disable the whole server, at any time.

You can also do all of this from the [CLI or API](/platform/customer-support/developer-api) instead of the dashboard.

## How Lira keeps it safe

Lira never lets the model call your server directly. Each tool you approve becomes a normal Lira agent tool and still passes the full runtime before it can run:

- **Nothing runs until an admin approves it** — discovery only lists your tools, it does not enable them.
- You **map each tool** to a risk level (read, confirm-first, re-auth required, or human-only) and who can use it (anyone, verified visitor, or verified customer).
- Money- and account-adjacent tools can require the customer to **re-authenticate (step-up)** before the action runs.
- The **verified customer identity** is sent to your server out-of-band, so the AI cannot impersonate a different customer through the tool inputs.
- Your **bearer credential is stored encrypted** and sent only to your endpoint; it is never shown back in the dashboard.
- Every call is **logged and metered**, and the whole server can be disabled or disconnected instantly.

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

## Built-in guardrails

Beyond per-tool approval, the gateway ships several protections you don't have to configure:

- **Rate limits** — each tool and the server as a whole have per-minute caps (set your own per tool, or rely on sensible defaults). A loop, a runaway agent, or a compromised server can't hammer your backend.
- **Change detection (anti "rug-pull")** — Lira pins the definition of every tool you approve. If your server later changes a tool's description or inputs, discovery flags it as **"changed since approval"** so you can re-review before it's trusted again.
- **Config audit** — every configuration change (connect, approve, enable/disable, disconnect) is logged with who and when, shown under **Recent activity**. Tool *calls* are logged separately in **Health & audit**.
- **Network safety** — in production the endpoint must be HTTPS and can't resolve to a private/internal address, checked again at connect time (blocks SSRF and DNS-rebinding).
- **Instant off switch** — disable any single tool, or the whole server, in one click.

## Plan availability

MCP actions follow your plan: **read-only** tools on Pro, and the **full approved set** on Scale and Enterprise. This keeps action-taking aligned with the tier your organization is on.
