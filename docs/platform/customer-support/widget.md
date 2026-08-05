---
sidebar_position: 4
title: Chat Widget
description: Install and customise the Lira chat widget on your website — one script tag, instant AI responses, full customisation.
---

# Chat Widget

The chat widget adds a floating chat button to your website. Visitors click it, type their question, and Lira responds instantly — grounded in your Knowledge Base — without the visitor needing to navigate away or send an email.

For a full support center inside your own app route, use the [Web SDK and full-page support embed](/platform/customer-support/web-sdk). The floating widget is best as an additional launcher on pages where a compact entry point makes sense.

---

## How it works

```
Visitor opens chat widget
  → Types a message
  → Lira searches your Knowledge Base for relevant content
  → Responds within seconds
  → If confidence is low → escalates to your team's inbox
```

Every chat conversation is visible in the **Inbox** (sidebar → Work → Inbox), and anything Lira escalates lands in **Tickets** alongside your email and portal tickets. Your team can jump in to reply manually at any point.

---

## Installing the widget

The widget is a single `<script>` tag. Paste it before the closing `</body>` tag on every page where you want the widget to appear.

```html
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-publishable-key="lira_pk_live_YOUR_KEY"
  data-greeting="Hi! How can we help you today?"
  data-position="bottom-right">
</script>
```

### Staging vs production

`data-publishable-key` is what tells Lira whether this embed is **test** or **live**. Use `lira_pk_test_…` on staging and preview deploys, and `lira_pk_live_…` in production — both are valid at once against the same workspace, so your staging site never consumes live quota, never triggers real emails or Slack/Linear/webhook deliveries, and never appears in the live inbox.

Copy both keys from **Settings → Support → API keys → Publishable keys**. They are publishable: shipping them in your HTML is expected and safe.

An embed with **no** publishable key follows your workspace environment, exactly as before — nothing you have already shipped breaks. An embed whose key is wrong (typo, rotated out) is forced into test mode rather than going live, and logs an `INVALID_PUBLISHABLE_KEY` warning to the browser console.

Voice calls launched from the widget use the same key. A staging widget call creates a test voice conversation, not a live one.

### Getting your snippet

After activation, the complete snippet with your actual `data-org-id` pre-filled is shown on the success screen. You can copy it again later from **Settings → Support → Get connected → Floating Chat Widget**.

### Where to add it

For most setups, add the snippet to your site's **global layout template** so it appears on every page. If you use:

- **React / Next.js** — add to `_app.tsx`, `layout.tsx`, or a `useEffect` in your root component
- **WordPress** — add via your theme's `functions.php` or a header/footer plugin
- **Webflow** — paste in **Project Settings → Custom Code → Footer Code**
- **Shopify** — paste in **Online Store → Themes → Edit code → Layout → theme.liquid**

### Important: `data-org-id` is permanent

Your `data-org-id` is tied to your organisation and never changes. You do not need to update it.

---

## Telling Lira about the signed-in user

The same runtime the script tag loads exposes `window.Lira.setContext(...)`, so
a plain widget embed can pass product context without adopting the full SDK:

```html
<script>
  window.Lira.setContext({
    external_customer_id: 'user_123',   // your id — used by MCP tools
    productType: 'corporate',           // if one workspace serves several products
    account: { plan: 'scale' },
  })
</script>
```

No key is reserved — Lira reads the whole object, and one level of nesting is
flattened. Identity itself (name, email, verified) comes from the `data-email` /
`data-sig` attributes below. Full detail: [what the AI knows about a signed-in
user](/platform/customer-support/web-sdk#what-the-ai-knows).

---

## Updating the widget after installation

The only thing you might want to change after the initial install is the `data-greeting` attribute. You can do this at any time:

- Edit the `data-greeting` value in your site's HTML
- **Changes take effect immediately** — no reinstall required

You can also change the widget's appearance (colour) from **Settings → Support → Get connected** — these changes are fetched automatically by the widget on every load, so you don't need to touch the script tag.

---

## Customising the widget

### Widget colour

Set the primary colour of the widget header and chat button from **Settings → Support → Get connected → Widget Color**. You can:

- Enter any 6-digit hex code (e.g. `#3730a3`)
- Pick from a curated palette of preset colours
- Preview the colour live via a colour swatch

The colour applies to the widget button, the header bar, and Lira's message bubbles.

### Greeting message

The greeting message is what Lira sends the moment a visitor opens the chat. You can set it from:

- **Settings → Support → Get connected → Greeting Message** — applies globally
- **The `data-greeting` attribute** in your script tag — overrides the global setting for that specific page

Keep it short and welcoming. You can ask a question to prompt the visitor:

> Hi! What can I help you with today?

or announce what Lira can help with:

> Hi! Ask me anything about our product, pricing, or support options.

---

## Live preview during activation

During the [activation wizard (Step 2)](/platform/customer-support/activation#step-2--web-surfaces-and-channels), you'll see a live interactive preview of the widget running an animated demo conversation. Switch between **Desktop** and **Mobile** views to see how it looks on different screen sizes.

This preview updates in real time as you change the greeting message, so you can finalise the wording before going live.

---

## Identifying visitors (optional)

By default, the widget is **anonymous** — anyone who opens it is treated as an unknown visitor. Lira can still answer questions and escalate to your team, but it has no idea who the visitor is.

If your website has logged-in users, you can optionally pass their identity to the widget. This unlocks two things:

- Lira greets the visitor by name and can look up their account details
- Your team sees the visitor's name and email in the escalated conversation in the Inbox

This is entirely optional. Most organisations start anonymous and add identification later.

---

### How visitor identity works

When a logged-in visitor loads your page, your **server** adds their identity to the widget script tag using three extra attributes:

```html
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-email="jane@yourcompany.com"
  data-name="Jane Smith"
  data-sig="HMAC_SIGNATURE_HERE">
</script>
```

The `data-sig` is a cryptographic signature that **proves your server generated these attributes**. Without it, anyone could open DevTools, change `data-email` to any address, and the widget would hand over that person's account data. The signature prevents this.

---

### The widget secret

The widget secret is a unique hex key tied to your organisation. It lives in **Settings → Support → API keys → Signing secret**.

**Your server uses this key to compute the signature.** The secret itself must **never** appear in your frontend code, your HTML, or the browser — it should only ever exist on your backend.

To find your secret: open the Lira dashboard → **Settings** (bottom of the sidebar) → **Support** tab → **Get connected** → scroll to **Widget secret** → click **Show**.

---

### Computing the signature

On your server, compute an HMAC-SHA256 of the visitor's email address using your widget secret as the key. The result is the value for `data-sig`.

**Node.js example:**

```js
import crypto from 'crypto'

const widgetSecret = process.env.LIRA_WIDGET_SECRET // from your env, never hardcoded
const sig = crypto.createHmac('sha256', widgetSecret).update(visitor.email).digest('hex')
```

**Python example:**

```python
import hmac, hashlib, os

widget_secret = os.environ['LIRA_WIDGET_SECRET']
sig = hmac.new(widget_secret.encode(), visitor.email.encode(), hashlib.sha256).hexdigest()
```

**PHP example:**

```php
$sig = hash_hmac('sha256', $visitor['email'], getenv('LIRA_WIDGET_SECRET'));
```

Then render the script tag server-side with the computed signature:

```html
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="YOUR_ORG_ID"
  data-email="<?= $visitor['email'] ?>"
  data-name="<?= $visitor['name'] ?>"
  data-sig="<?= $sig ?>">
</script>
```

:::danger Never compute the signature in the browser
If your widget secret is visible in your frontend JavaScript, it is compromised. Any visitor could read it and forge signatures for any email address. The HMAC must be computed server-side only.
:::

---

### What happens if the signature is wrong?

If `data-sig` is missing or doesn't match, Lira silently falls back to anonymous mode. No error is shown to the visitor, and no customer data is exposed. You can verify the signature is being accepted correctly by checking the browser's network tab — the WebSocket handshake response will indicate whether the visitor was authenticated as a verified customer.

---

### SPAs / post-load identity: `window.Lira.identify()`

Most modern apps don't know who the visitor is when the page first loads — auth state arrives later from a session call, an OAuth redirect, a `useEffect`, etc. For these cases, set the script tag with **just the org id**, then call `window.Lira.identify(...)` whenever your auth state resolves.

```js
// Anywhere your auth-resolved callback runs (Next.js useEffect, React Query
// onSuccess, Vue created, Supabase onAuthStateChange, etc.):
async function onUserResolved(user) {
  // 1) Ask YOUR backend to compute the signature — never compute it in the browser.
  const { sig } = await fetch('/api/lira-sig', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email }),
  }).then((r) => r.json())

  // 2) Hand Lira the identity. Safe to call multiple times — re-identifies in place.
  window.Lira?.identify({
    email: user.email,
    name: user.name,
    sig,
  })
}
```

On your backend, the `/api/lira-sig` endpoint is a thin wrapper over the same HMAC you'd run for server-rendered pages:

```js
// Node.js / Express
app.post('/api/lira-sig', requireAuth, (req, res) => {
  const sig = crypto
    .createHmac('sha256', process.env.LIRA_WIDGET_SECRET)
    .update(req.user.email)
    .digest('hex')
  res.json({ sig })
})
```

The widget queues the identity call until the script has finished loading — `window.Lira?.identify(...)` is safe to call any time after the script tag is in the DOM, before or after page load.

---

### Logout: `window.Lira.logout()`

When your user logs out, tell the widget. Lira wipes the chat history off this device and rotates the anonymous chat scope, so the next visitor on a shared computer doesn't see anything the previous user did.

```js
// In your logout handler, after you've cleared your own session:
window.Lira?.logout()
```

This is the missing piece most teams forget. Without it, a user can chat with Lira while signed in, log out, hand the laptop to a teammate, and the teammate sees the previous user's conversation. Calling `logout()` solves that.

`logout()` is equivalent to `identify({ email: null, name: null, sig: null })` — either form works.

---

### Chat history & identity scope — what the widget remembers

The widget scopes its local chat cache to identity, so two users on the same browser never see each other's history. Specifically:

| Visitor state | Local cache scope | Cross-device |
|---|---|---|
| **Identified** (you called `identify(...)` with a valid `sig`) | `lira_chat_<orgId>_u_<email>` localStorage entry, **+ server-side history fetched on identify** | ✅ The widget pulls the visitor's recent conversation from the server on `identify()`. Log in on a phone after chatting on desktop → history follows. |
| **Anonymous** (no identify, or pre-chat form) | `lira_chat_<orgId>_anon_<anonChatId>` — anon id is rotating | ❌ Lives on this device only. Rotated when an identified user logs out, so a shared device starts clean for the next visitor. |
| **After logout** | Identified cache wiped, anon id rotated, fresh empty chat | n/a |
| **Switching identity** (different user logs in on same browser) | Previous user's cache wiped, new user's cache fetched | The new user sees only their own history. |

All of this is automatic — you don't configure anything. The widget does the right thing as long as you call `identify()` on login and `logout()` on logout.

---

### Live product context: `window.Lira.setContext()`

Identity tells Lira **who** the visitor is. Live context tells her **what they're doing right now**. Call it from your app whenever the relevant state changes — current page, current plan, current open invoice, whatever might matter to the support conversation.

```js
window.Lira?.setContext({
  page: window.location.pathname,
  account: {
    plan: 'Growth',
    billing_status: 'overdue',
    open_invoices: 1,
  },
  ui: { active_modal: 'upgrade-prompt' },
})
```

Call `setContext` whenever a relevant state changes. Lira reads the most recent context on every visitor turn — so by the time someone clicks the chat bubble, she already knows their plan is overdue and can lead with that.

---

### Anonymous-visitor fallback: pre-chat form

If you haven't wired identity yet (or the visitor genuinely isn't logged in), Lira can ask for name + email before the chat starts. This is on by default for new orgs. Without it, anonymous visitors land straight in chat and Lira has no identity context to work with. There is currently no dashboard toggle for the pre-chat form — contact the Lira team if you need it changed.

---

### Rotating the secret

If your secret is ever accidentally exposed (committed to a repository, logged, etc.), rotate it immediately from **Settings → Support → API keys → Signing secret → Rotate**. You'll be asked to confirm, and a new secret is generated instantly. Update your server-side environment variable with the new value — the old secret stops working immediately.

---

## Widget data attributes reference

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-org-id` | Yes | Your organisation ID — permanent, pre-filled in your snippet |
| `data-greeting` | No | Opening message Lira sends when chat opens (default: setting from dashboard) |
| `data-position` | No | `bottom-right` (default) or `bottom-left` |
| `data-email` | No* | Visitor's email address — required for identified visitor mode |
| `data-name` | No* | Visitor's display name — required for identified visitor mode |
| `data-sig` | No* | HMAC-SHA256 signature of `data-email` using your widget secret — required for identified visitor mode |

*All three (`data-email`, `data-name`, `data-sig`) must be present together. If any is missing, the widget falls back to anonymous mode.

---

## Frequently asked questions

**Can I show the widget only on certain pages?**
Yes — add the script tag only to the pages where you want it, rather than the global layout.

**Can I delay the widget from loading?**
The widget loads asynchronously and doesn't block page rendering. If you want it to appear with a delay, you can load the script tag via JavaScript after a timeout.

**What happens to widget conversations if I disable the channel?**
Existing conversations remain in your Inbox. New chats will not be accepted — the widget will display a fallback message directing customers to your support email.

**Is the widget GDPR-compliant?**
The widget stores the conversation in your organisation's data environment. No customer data is used for training.

**Do I need the widget secret for basic chat support?**
No. Anonymous visitor mode requires only `data-org-id`. The secret is only needed if you want Lira to recognise logged-in users and access their account data.

**What does Lira do differently for identified visitors?**
Lira greets the visitor by name. It can also call the `get_customer_profile` tool to retrieve account information (plan tier, contact details) and reference it in its responses. Anonymous visitors never receive another customer's data — the agent will decline profile lookups when no verified identity is present.
