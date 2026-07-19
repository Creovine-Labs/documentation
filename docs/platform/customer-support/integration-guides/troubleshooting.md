---
sidebar_position: 10
title: Troubleshooting
description: Why the Lira widget isn't responding on your site, and the exact fix for each cause.
---

# Troubleshooting

Symptom-to-cause map for the most common Lira integration issues. If something looks broken on your site, find your symptom below and apply the fix. The same diagnostics run in **Lira dashboard → Settings → Support → Health & audit**, and Lira's own AI runs them when you ask it about widget issues.

:::tip First step: open the browser console
The widget logs **branded `[Lira]` warnings** to the browser console whenever an integration check fails. Open DevTools → Console on the page where the widget is embedded. If you see a `[Lira]` warning, the message names the exact cause and the fix.
:::

---

## Symptom: the widget is completely silent — no typing, no reply

The widget bubble appears, you type a message, and nothing happens — no typing indicator, no answer, no error visible to the end user.

**Most likely causes, in order:**

### 1. Identity signature mismatch {#identity-signature-mismatch}

You're using identified-visitor mode (passing `data-email`, `data-sig`, or calling `Lira.identify()`), but your backend signs visitor emails with a **different secret** than what's in your Lira config. The WebSocket handshake fails, falls back to anonymous mode, and the widget logs:

```
[Lira] ⚠ IDENTITY_SIGNATURE_MISMATCH — running degraded
```

**Fix:** Make sure your server's `LIRA_WIDGET_SECRET` env var matches exactly what's in **Lira dashboard → Settings → Support → Get connected → Widget secret**. If you rotated the secret in the dashboard, update your backend too. Both sides MUST use the same secret. The chat keeps working in anonymous mode until you fix this.

### 2. Web SDK Runtime not enabled {#chat-not-enabled}

The `chat_enabled` flag is off on your org config. The WS handshake rejects every connection with code 4001.

**Fix:** Lira dashboard → **Settings → Support → Channels** → toggle **Web Chat Runtime** ON → Save.

### 3. Wrong `data-org-id`

The embed snippet on your site has a typo, an old org ID, or an ID for a different account. Connections go to a non-existent config and close silently.

**Fix:** Copy the snippet from **Lira dashboard → Settings → Support → Get connected** fresh and replace your embed.

### 4. CSP / network blocking

Your site's Content Security Policy or a corporate proxy blocks `widget.liraintelligence.com` or `api.creovine.com`. The widget loads, but its WebSocket never connects.

**Fix:** Allow these origins in your CSP:
```
script-src https://widget.liraintelligence.com
connect-src https://api.creovine.com wss://api.creovine.com
```

### 5. Stale cached `widget.js`

Your browser (or CDN edge) is serving an old version. Hard-reload (Cmd+Shift+R / Ctrl+Shift+R) or open in incognito. If it works in incognito, it's a browser cache.

---

## Symptom: 401 Unauthorized on the WebSocket handshake {#401-unauthorized}

You see in DevTools → Network → WS:
```
WebSocket connection to '.../chat/ws/...?email=...&sig=...' failed: 401
```

This is **always** an identity-signature mismatch. See [Identity signature mismatch](#identity-signature-mismatch) above.

---

## Symptom: the widget shows but you can't dismiss the name/email form

The pre-chat form is configured to require an email before chatting (for anonymous visitors who'll later need a ticket).

**Fix:** Pass an identified visitor (your backend signs the email so the widget skips the form), or ask the Lira team to disable the pre-chat form for your org — there is currently no dashboard toggle for it.

---

## Symptom: AI replies but doesn't know who the visitor is

The widget connects, but the AI greets generically ("Hi! How can we help?") instead of by name, and can't access account-specific tools.

**Cause:** The identity signature isn't matching, so the backend is treating the visitor as anonymous (degraded mode). You're not silent because of [resilience](#resilience-design), but identity isn't verified.

**Fix:** Check the browser console for `[Lira] IDENTITY_SIGNATURE_MISMATCH`, then apply the [identity-signature-mismatch fix](#identity-signature-mismatch).

---

## Symptom: no tickets created when the AI escalates

Lira opens tickets, but your team never gets the notification email.

### Ticketing email missing {#ticketing-email-missing}

**Fix:** Lira dashboard → **Settings → Support → Escalation** → set a team email → Save.

### Email blocked by your provider

The email lands in spam or is blocked by a firewall.

**Fix:** Whitelist `support@liraintelligence.com` (or your custom `from` address).

---

## Symptom: widget bubble doesn't appear at all

The `<script>` is in your HTML but no bubble renders.

**Check:**

- **Network → JS**: does `widget.liraintelligence.com/v1/widget.js` return 200? If 4xx/5xx, the script can't load.
- **Console**: any red errors loading the script? CSP block?
- **DOM**: a host element should be appended near `</body>` — inspect for `<div data-lira-mode="…">`.
- **Multiple embeds**: if you have more than one `<script src=".../widget.js">` on the page (e.g. one in a layout + one in a component), the second one is ignored. Keep only one.

---

## Symptom: widget CDN unreachable {#widget-cdn-unreachable}

The Integration Health check reports "Widget CDN reachable" as failed.

**Fix:** Likely a transient network or CDN issue. Wait a minute and retry. If it persists, check [https://status.liraintelligence.com](https://status.liraintelligence.com).

---

## Symptom: widget secret missing {#widget-secret-missing}

The Integration Health check reports your widget secret isn't provisioned.

**Fix:** The secret is generated at activation. Open **Settings → Support → Get connected → Widget secret** — if it shows "Secret not available", complete activation first. If a secret exists but you need a fresh one, click **Rotate**, then copy the new value into your backend `LIRA_WIDGET_SECRET`.

---

## Symptom: org config missing {#config-missing}

Integration Health reports "Support config provisioned: failed".

**Cause:** Customer support was never activated for this org.

**Fix:** Lira dashboard → **Support → Activate** and complete the wizard.

---

## Symptom: not activated {#not-activated}

Config exists but `activated` is false.

**Fix:** Lira dashboard → **Support → Activate** → click **Activate Support** at the end of the wizard.

---

## Resilience design

The Lira widget is designed to **degrade gracefully**, not black out, on integration mistakes. Specifically:

- **Bad signature** → fall back to anonymous mode (chat still works, just no identity context). A console warning is logged.
- **Escalation** → never silences the live AI chat. Opens an async ticket on the separate human track instead.
- **Force-escalate intent** → ticket created, AI still answers.
- **Volume cap hit** → ticket created, the AI tells the visitor by email.

So an end-user should **never** see a frozen widget. If you ever do, that's a real bug — file it and we'll investigate.

---

## Self-diagnosis tools

Three places you can check your integration without contacting us:

1. **Dashboard → Settings → Support → Health & audit** — runs every diagnostic with green/red checks + fixes.
2. **Browser DevTools → Console** on the page where the widget is embedded — `[Lira]` warnings name the exact cause + fix + docs link.
3. **Ask Lira's own AI in the Lira dashboard widget** — it runs the same Integration Health diagnostics and explains failures in plain English.

Use these before opening a support ticket — 90% of "the widget isn't working" cases are diagnosed and fixed in under a minute via these tools.
