---
sidebar_position: 5
title: CMS
description: Content Management System — homepage, page content, and navigation.
---

# CMS

The platform includes a headless CMS for managing marketing site content. Public endpoints serve cached content; admin endpoints manage it.

## Public Endpoints

All public CMS routes are **unauthenticated** and cache-friendly:

| Method | Path | Cache | Description |
|:---|:---|:---|:---|
| GET | `/v1/cms/homepage` | 60s client / 300s CDN | All homepage CMS data |
| GET | `/v1/cms/page/:pageId` | 60s / 300s | Content blocks for a page |
| GET | `/v1/cms/nav` | 300s / 600s | Navigation items |

## Homepage Response

```json
{
  "hero": [...],
  "banners": [...],
  "logos": [...],
  "portfolio": [...],
  "cta": [...]
}
```

## Content Blocks

Generic key/value content for any page. Useful for landing pages, product pages, and legal content.

```json
{
  "pageId": "privacy-policy",
  "key": "main-content",
  "value": "...",
  "updatedAt": "2026-03-29T..."
}
```

## Admin Management

Requires ADMIN+ role — see [Platform Admin](/platform/admin) for full CRUD endpoints.
