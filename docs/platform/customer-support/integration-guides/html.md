---
sidebar_position: 8
title: Plain HTML integration guide
description: Add Lira support to a static / no-build site in ~2 minutes.
---

# Plain HTML integration guide

If your site is plain HTML (or built with Hugo, Jekyll, Eleventy, plain JS) with no Node bundler, this is the fastest install path.

**Time:** ~2 minutes.

---

## Step 1 — Drop the snippet on your support page

Create `support.html` (or wherever you want the support hub to live) and paste:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Support — YourCompany</title>
</head>
<body>
  <h1>Support</h1>
  <p>Ask anything. Our AI answers instantly and opens a ticket for our team if it can't.</p>

  <div id="lira-support-root" style="max-width: 960px; margin: 0 auto; height: 720px;"></div>

  <script
    src="https://widget.liraintelligence.com/v1/widget.js"
    data-org-id="YOUR_ORG_ID"
    data-mode="fullscreen"
    data-target="#lira-support-root"
  ></script>
</body>
</html>
```

Replace `YOUR_ORG_ID` with your value from **Lira Settings → Organization**.

---

## Step 2 — Open it

Open `support.html` in your browser or upload it to your site. That's it — anonymous chat works.

---

## Adding the floating widget on every page

To put a chat bubble on every page of your site, add this single line before `</body>` in every HTML file (or in your site template):

```html
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-position="bottom-right"
></script>
```

---

## Identified visitors (if you have logged-in users)

Plain HTML usually means no backend. If you DO have a backend somewhere (Cloudflare Worker, Netlify Function, Vercel serverless), add a signing endpoint:

```ts
// Cloudflare Worker example
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.url.endsWith('/api/lira/sign')) {
      const { email } = await req.json()
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(env.LIRA_WIDGET_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      const sig = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(email.trim().toLowerCase())
      )
      const hex = Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      return Response.json({ sig: hex })
    }
    return new Response('Not Found', { status: 404 })
  },
}
```

Then in your HTML, fetch the signature and pass it via JS:

```html
<script>
  fetch('/api/lira/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: currentUserEmail }),
  })
    .then((r) => r.json())
    .then(({ sig }) => {
      window.Lira.init({ orgId: 'YOUR_ORG_ID' })
      window.Lira.identify({ email: currentUserEmail, name: currentUserName, sig })
      window.Lira.mountSupportPage('#lira-support-root')
    })
</script>
```

---

## Common pitfalls

**Widget doesn't appear**
- Check the browser console for errors loading the script
- Confirm `YOUR_ORG_ID` is replaced with your actual ID (not the placeholder)
- The `#lira-support-root` div needs a height — fullscreen mode fills it

**Identity not recognised**
Identified visitors require a backend to sign emails — if you're purely static and have no logged-in users, skip this.

---

## Next steps

- [SDK API reference](/platform/customer-support/web-sdk)
- [Widget customisation](/platform/customer-support/widget)
