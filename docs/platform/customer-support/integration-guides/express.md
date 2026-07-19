---
sidebar_position: 7
title: Express + frontend integration guide
description: Add Lira support with an Express backend + any frontend in ~10 minutes.
---

# Express + frontend integration guide

For apps with an Express backend and any frontend (vanilla, Vue, Svelte, Alpine, htmx, etc.), you need two things:

1. A signing endpoint on the Express server
2. The Lira runtime `<script>` tag on your support page

**Time:** ~10 minutes.

---

## Step 1 — Add the signing endpoint

```ts
// server/lira.ts (or wherever you mount routes)
import crypto from 'node:crypto'
import { Router } from 'express'

const router = Router()

router.post('/api/lira/sign', requireAuth, (req, res) => {
  const email = req.user.email.trim().toLowerCase()  // from your session middleware
  const sig = crypto
    .createHmac('sha256', process.env.LIRA_WIDGET_SECRET!)
    .update(email)
    .digest('hex')
  res.json({ sig })
})

export default router
```

Replace `requireAuth` with your existing auth middleware (Passport, express-session, JWT, whatever). The endpoint reads the email from the authenticated session — do NOT accept it from the request body in production (that lets anyone sign any email).

---

## Step 2 — Set environment variables

```env
LIRA_ORG_ID=org-xxxxxxxxxxxx
LIRA_WIDGET_SECRET=lirask_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 3 — Add the support page

If your frontend is server-rendered (EJS, Pug, Handlebars), render this template:

```html
<!-- views/support.ejs -->
<!doctype html>
<html>
<body>
  <h1>Support</h1>
  <div id="lira-support-root" style="height: 720px;"></div>

  <script
    src="https://widget.liraintelligence.com/v1/widget.js"
    data-org-id="<%= process.env.LIRA_ORG_ID %>"
    data-mode="fullscreen"
    data-target="#lira-support-root"
    <% if (user) { %>
      data-email="<%= user.email %>"
      data-name="<%= user.name %>"
      data-sig="<%= liraSig %>"
    <% } %>
  ></script>
</body>
</html>
```

And in the route:

```ts
import crypto from 'node:crypto'

app.get('/support', requireAuth, (req, res) => {
  let liraSig
  if (req.user?.email) {
    liraSig = crypto
      .createHmac('sha256', process.env.LIRA_WIDGET_SECRET!)
      .update(req.user.email.trim().toLowerCase())
      .digest('hex')
  }
  res.render('support', { user: req.user, liraSig })
})
```

If your frontend is a separate SPA (Vue, Svelte, vanilla), call `/api/lira/sign` from the client and pass the returned `sig` to the widget mount.

---

## Step 4 — Run it

```bash
node server.js
```

Visit `http://localhost:3000/support`.

---

## Common pitfalls

**Anyone can sign any email**
If your `/api/lira/sign` route accepts `email` from the request body without checking auth, anyone can spoof anyone. Always read the email from your authenticated session, not the request payload.

**CORS errors**
If the frontend is on a different origin from Express, configure `cors()`:

```ts
import cors from 'cors'
app.use(cors({ origin: 'https://yourfrontend.com', credentials: true }))
```

And in the fetch, use `credentials: 'include'`.

---

## Next steps

- [SDK API reference](/platform/customer-support/web-sdk)
- [Widget customisation](/platform/customer-support/widget)
