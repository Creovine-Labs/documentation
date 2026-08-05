---
sidebar_position: 6
title: Django integration guide
description: Add Lira support to a Django app in ~10 minutes.
---

# Django integration guide

For Django apps, load the Lira runtime via a `<script>` tag on your support template, and sign visitor emails in a Django view. No npm package required.

**Time:** ~10 minutes.

---

## Step 1 — Create the support template

```html
{# templates/support.html #}
{% load static %}

<!DOCTYPE html>
<html>
<head>
  <title>Support — YourCompany</title>
</head>
<body>
  <h1>Support</h1>
  <p>Ask anything. Our AI answers instantly and opens a ticket for our team if it can't.</p>

  <div id="lira-support-root" style="height: 720px;"></div>

  <script
    src="https://widget.liraintelligence.com/v1/widget.js"
    data-org-id="{{ lira_org_id }}"
    data-publishable-key="{{ lira_publishable_key }}"
    data-mode="fullscreen"
    data-target="#lira-support-root"
    {% if user.is_authenticated %}
      data-email="{{ user.email }}"
      data-name="{{ user.get_full_name }}"
      data-sig="{{ lira_sig }}"
    {% endif %}
  ></script>
</body>
</html>
```

---

## Step 2 — Add the view

```python
# views.py
import hmac
import hashlib
from django.conf import settings
from django.shortcuts import render

def support(request):
    context = {
        'lira_org_id': settings.LIRA_ORG_ID,
        'lira_sig': None,
    }
    if request.user.is_authenticated and request.user.email:
        context['lira_sig'] = hmac.new(
            settings.LIRA_WIDGET_SECRET.encode(),
            request.user.email.strip().lower().encode(),
            hashlib.sha256,
        ).hexdigest()
    return render(request, 'support.html', context)
```

---

## Step 3 — Add the URL

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('support/', views.support, name='support'),
]
```

---

## Step 4 — Configure settings

```python
# settings.py
import os

LIRA_ORG_ID = os.environ['LIRA_ORG_ID']
LIRA_WIDGET_SECRET = os.environ['LIRA_WIDGET_SECRET']
```

In your environment:

```env
LIRA_ORG_ID=org-xxxxxxxxxxxx
LIRA_WIDGET_SECRET=lirask_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 5 — Run it

```bash
python manage.py runserver
```

Visit `http://localhost:8000/support/`.

---

## Add the floating widget on every page (optional)

In your base template (`base.html`), before `</body>`:

```html
<script
  src="https://widget.liraintelligence.com/v1/widget.js"
  data-org-id="{{ lira_org_id }}"
  data-publishable-key="{{ lira_publishable_key }}"
  {% if user.is_authenticated %}
    data-email="{{ user.email }}"
    data-name="{{ user.get_full_name }}"
    data-sig="{{ lira_sig }}"
  {% endif %}
  data-position="bottom-right"
></script>
```

Make every view include `lira_org_id` and `lira_sig` in context — easiest way is a [template context processor](https://docs.djangoproject.com/en/stable/ref/templates/api/#django.template.RequestContext) that injects them on every request.

---

## Common pitfalls

**`lira_sig` is None for logged-in users**
Confirm `request.user.is_authenticated` returns True AND `request.user.email` is populated. Some Django auth backends don't store email by default.

**Wrong signature**
The lowercase + strip step matters — Lira's backend verifies HMAC against the lowercased, trimmed email.

---

## Next steps

- [SDK API reference](/platform/customer-support/web-sdk)
- [Widget customisation](/platform/customer-support/widget)
