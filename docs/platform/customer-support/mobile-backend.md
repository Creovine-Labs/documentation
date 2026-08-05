---
sidebar_position: 9
title: "Mobile: the backend part"
description: For the backend engineer. Add one endpoint that gives your mobile app a Lira support session. Copy-paste examples in Node, Python, Ruby, Go, and PHP.
keywords:
  - mobile backend
  - session token
  - mint
  - api key
  - backend
  - node
  - python
  - ruby
  - go
  - php
---

# Mobile: the backend part

**Who this page is for:** the **backend engineer**. If you build the mobile app
itself, you want [the app part](/platform/customer-support/mobile-frontend) instead.

**Your entire job:** add **one endpoint** to your API. It takes ~20 lines.

---

## Why this endpoint exists

Your Lira **API key is a secret**. If you put it in the mobile app, anyone can
pull it out of the app binary and impersonate your support system.

So the app never sees the key. Instead:

```
Mobile app  ──►  YOUR backend  ──►  Lira
              (asks for a       (holds the API key,
               support session)  swaps it for a short-lived token)
```

Your endpoint hands back a **short-lived session token** for that one logged-in
customer. That's it. That's the whole job.

---

## What you need

1. **Your Lira API key** — `lira_sk_...`
   Dashboard → **Settings → Support → Developers → New key** → tick **`sessions:mint`**.
2. **Your Organization ID** — `org-...`
   Dashboard → **Settings → Organization → General** (Copy button).

Store both as environment variables — `LIRA_API_KEY` and `LIRA_ORG_ID`. Never commit them.

---

## The one call you make to Lira

```
POST https://api.creovine.com/lira/v1/support/sessions/orgs/{YOUR_ORG_ID}/mint
```

**Headers**
```
Authorization: Bearer lira_sk_your_key_here
Content-Type: application/json
```

**Body**
```json
{
  "customer": { "email": "ada@example.com", "name": "Ada Lovelace" },
  "context":  { "app": "my-app", "platform": "mobile" },
  "ttlSeconds": 3600
}
```

- `customer` — **the logged-in user from your own session.** Never accept this from the app; take it from your auth. This is what tells Lira who it's talking to.
- `context` — optional free-form info you want the AI to know (plan, app version…).
- `ttlSeconds` — how long the session lasts. 3600 (1 hour) is a good default.

**Response** — pass this straight back to your app:

```json
{
  "token": "…",
  "ws_url": "wss://api.creovine.com/lira/v1/support/chat/ws/…"
}
```

The app only really needs **`ws_url`** — that's the address it opens.

---

## Copy-paste implementations

Add an endpoint on your API — call it `POST /support/session` — that is
**protected by your normal login**. Here it is in five languages.

### Node / Express

```js
app.post('/support/session', requireAuth, async (req, res) => {
  const r = await fetch(
    `https://api.creovine.com/lira/v1/support/sessions/orgs/${process.env.LIRA_ORG_ID}/mint`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LIRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: { email: req.user.email, name: req.user.name },  // from YOUR auth
        context: { app: 'my-app', platform: 'mobile' },
        ttlSeconds: 3600,
      }),
    },
  );
  if (!r.ok) return res.status(502).json({ error: 'Could not start support session' });
  res.json(await r.json());          // → { token, ws_url }
});
```

### Python / FastAPI

```python
@app.post("/support/session")
async def support_session(user = Depends(current_user)):
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"https://api.creovine.com/lira/v1/support/sessions/orgs/{LIRA_ORG_ID}/mint",
            headers={"Authorization": f"Bearer {LIRA_API_KEY}"},
            json={
                "customer": {"email": user.email, "name": user.name},   # from YOUR auth
                "context": {"app": "my-app", "platform": "mobile"},
                "ttlSeconds": 3600,
            },
        )
    if r.status_code != 200:
        raise HTTPException(502, "Could not start support session")
    return r.json()          # → { token, ws_url }
```

### Ruby / Rails

```ruby
def support_session
  res = Faraday.post(
    "https://api.creovine.com/lira/v1/support/sessions/orgs/#{ENV['LIRA_ORG_ID']}/mint",
    { customer: { email: current_user.email, name: current_user.name },
      context: { app: "my-app", platform: "mobile" },
      ttlSeconds: 3600 }.to_json,
    { "Authorization" => "Bearer #{ENV['LIRA_API_KEY']}",
      "Content-Type"  => "application/json" }
  )
  render json: res.body        # → { token, ws_url }
end
```

### Go

```go
func supportSession(w http.ResponseWriter, r *http.Request) {
    user := currentUser(r)  // from YOUR auth
    body, _ := json.Marshal(map[string]any{
        "customer":   map[string]string{"email": user.Email, "name": user.Name},
        "context":    map[string]string{"app": "my-app", "platform": "mobile"},
        "ttlSeconds": 3600,
    })
    url := "https://api.creovine.com/lira/v1/support/sessions/orgs/" + os.Getenv("LIRA_ORG_ID") + "/mint"
    req, _ := http.NewRequest("POST", url, bytes.NewReader(body))
    req.Header.Set("Authorization", "Bearer "+os.Getenv("LIRA_API_KEY"))
    req.Header.Set("Content-Type", "application/json")
    resp, err := http.DefaultClient.Do(req)
    if err != nil || resp.StatusCode != 200 {
        http.Error(w, "Could not start support session", 502); return
    }
    defer resp.Body.Close()
    io.Copy(w, resp.Body)        // → { token, ws_url }
}
```

### PHP / Laravel

```php
public function supportSession(Request $request) {
    $user = $request->user();   // from YOUR auth
    $res = Http::withToken(env('LIRA_API_KEY'))
        ->post("https://api.creovine.com/lira/v1/support/sessions/orgs/".env('LIRA_ORG_ID')."/mint", [
            'customer'   => ['email' => $user->email, 'name' => $user->name],
            'context'    => ['app' => 'my-app', 'platform' => 'mobile'],
            'ttlSeconds' => 3600,
        ]);
    return $res->json();         // → { token, ws_url }
}
```

---

## Test it before handing over

```bash
curl -X POST https://yourapi.com/support/session \
  -H "Authorization: Bearer <one of your own user tokens>"
```

You should get back JSON containing **`ws_url`**. If you do, **you're finished** —
tell your mobile developer the endpoint is live and give them its URL.

---

## Checklist

- [ ] API key created with the **`sessions:mint`** scope
- [ ] Key + Org ID stored as env vars (**not** in the repo, **not** in the app)
- [ ] `POST /support/session` exists and requires your normal login
- [ ] `customer` comes from **your authenticated session**, never from the request body
- [ ] `curl` returns a `ws_url`
- [ ] Mobile developer told the endpoint URL → send them **[the app part](/platform/customer-support/mobile-frontend)**

---

## Common problems

| What you see | Fix |
|---|---|
| `401` from Lira | Wrong or revoked API key. Create a new one in Settings → Support → Developers. |
| `403` scope error | The key is missing the **`sessions:mint`** scope. Create a new key with it ticked. |
| `404` | Wrong Org ID in the URL. Recopy it from Settings → Organization → General. |
| Response has no `ws_url` | You're calling the wrong endpoint — check the URL path exactly. |
