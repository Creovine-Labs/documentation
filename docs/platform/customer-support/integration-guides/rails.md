---
sidebar_position: 5
title: Ruby on Rails integration guide
description: Add Lira support to a Rails app in ~10 minutes.
---

# Ruby on Rails integration guide

For Rails apps, you load the Lira runtime via a `<script>` tag on your support view, and sign visitor emails in a Rails controller. No npm package required.

**Time:** ~10 minutes.

---

## Step 1 — Create the support view

```erb
<%# app/views/support/show.html.erb %>

<%= content_for :body_class, 'lira-support-page' %>

<h1>Support</h1>
<p>Ask anything. Our AI answers instantly and opens a ticket for our team if it can't.</p>

<div id="lira-support-root" style="height: 720px;"></div>

<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="<%= ENV['LIRA_ORG_ID'] %>"
  data-publishable-key="<%= ENV['LIRA_PUBLISHABLE_KEY'] %>"
  data-mode="fullscreen"
  data-target="#lira-support-root"
  <% if current_user %>
    data-email="<%= current_user.email %>"
    data-name="<%= current_user.name %>"
    data-sig="<%= lira_visitor_signature(current_user.email) %>"
  <% end %>
></script>
```

---

## Step 2 — Add the helper

```ruby
# app/helpers/lira_helper.rb
module LiraHelper
  def lira_visitor_signature(email)
    OpenSSL::HMAC.hexdigest(
      'sha256',
      ENV.fetch('LIRA_WIDGET_SECRET'),
      email.strip.downcase
    )
  end
end
```

---

## Step 3 — Add the route + controller

```ruby
# config/routes.rb
get '/support', to: 'support#show'
```

```ruby
# app/controllers/support_controller.rb
class SupportController < ApplicationController
  # Comment out if your support page should be public
  # before_action :authenticate_user!

  def show; end
end
```

---

## Step 4 — Set environment variables

In `config/credentials.yml.enc` (or `.env` if you use dotenv):

```yaml
lira:
  org_id: org-xxxxxxxxxxxx
  widget_secret: lirask_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If using `.env`:

```env
LIRA_ORG_ID=org-xxxxxxxxxxxx
LIRA_WIDGET_SECRET=lirask_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 5 — Run it

```bash
bin/rails server
```

Visit `http://localhost:3000/support`.

---

## Add the floating widget on every page (optional)

In `app/views/layouts/application.html.erb`, before the closing `</body>`:

```erb
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="<%= ENV['LIRA_ORG_ID'] %>"
  data-publishable-key="<%= ENV['LIRA_PUBLISHABLE_KEY'] %>"
  <% if current_user %>
    data-email="<%= current_user.email %>"
    data-name="<%= current_user.name %>"
    data-sig="<%= lira_visitor_signature(current_user.email) %>"
  <% end %>
  data-position="bottom-right"
></script>
```

---

## Common pitfalls

**Identity not recognised**
- Confirm `LIRA_WIDGET_SECRET` matches **Lira Settings → Support → API keys → Signing secret** exactly
- The `email.strip.downcase` step matters — Lira's backend lowercases + trims before verifying the HMAC

**CSP errors**
If you have a strict Content Security Policy, allow `https://widget.liraintelligence.com` in `script-src` and `https://api.creovine.com` in `connect-src`.

---

## Next steps

- [SDK API reference](/platform/customer-support/web-sdk)
- [Widget customisation](/platform/customer-support/widget)
