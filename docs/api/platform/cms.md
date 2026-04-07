---
sidebar_position: 4
title: CMS
description: Content Management System API — pages, sections, and media.
---

# CMS API

**Base URL:** `https://api.creovine.com/cms`

The CMS powers dynamic content on the Creovine website and console. Admin endpoints require `X-Admin-Key`.

## Public Endpoints

### List Pages

```http
GET /cms/pages
```

### Get Page

```http
GET /cms/pages/:slug
```

**Response** `200 OK`:
```json
{
  "page": {
    "id": "uuid",
    "slug": "home",
    "title": "Home",
    "sections": [
      {
        "id": "uuid",
        "type": "hero",
        "content": { "heading": "...", "subheading": "..." },
        "order": 1
      }
    ],
    "meta": { "title": "...", "description": "..." }
  }
}
```

## Admin Endpoints

### Create Page

```http
POST /admin/cms/pages
X-Admin-Key: <admin-secret>

{
  "slug": "about",
  "title": "About Us",
  "sections": [],
  "meta": { "title": "About — Creovine", "description": "..." }
}
```

### Update Page

```http
PUT /admin/cms/pages/:pageId
X-Admin-Key: <admin-secret>
```

### Upload Media

```http
POST /admin/cms/media
X-Admin-Key: <admin-secret>
Content-Type: multipart/form-data
```

### List Media

```http
GET /admin/cms/media
X-Admin-Key: <admin-secret>
```
