---
sidebar_position: 4
title: Admin
description: Platform administration — user management, analytics, and CMS.
---

# Platform Admin

Admin endpoints are available at `/v1/platform/admin` and require `ADMIN` or `SUPER_ADMIN` role.

## User Management

| Method | Path | Role | Description |
|:---|:---|:---|:---|
| GET | `/v1/platform/admin/users` | ADMIN+ | List all users (supports `?search=`) |
| GET | `/v1/platform/admin/admins` | SUPER_ADMIN | List all admins & super-admins |
| POST | `/v1/platform/admin/users/:id/promote` | SUPER_ADMIN | Promote user → ADMIN |
| POST | `/v1/platform/admin/users/:id/demote` | SUPER_ADMIN | Demote ADMIN → USER |

## CMS Admin

Content management endpoints for the homepage and marketing pages:

| Method | Path | Description |
|:---|:---|:---|
| GET | `/v1/platform/admin/products` | List all products (including drafts) |
| POST | `/v1/platform/admin/products` | Create product |
| PUT | `/v1/platform/admin/products/:id` | Update product |
| DELETE | `/v1/platform/admin/products/:id` | Delete product |
| GET | `/v1/platform/admin/homepage-slots` | List homepage CMS slots |
| POST | `/v1/platform/admin/homepage-slots` | Create homepage slot |
| PUT | `/v1/platform/admin/homepage-slots/:id` | Update slot |
| DELETE | `/v1/platform/admin/homepage-slots/:id` | Delete slot |
| GET | `/v1/platform/admin/content-blocks` | List content blocks |
| PUT | `/v1/platform/admin/content-blocks/:page/:key` | Upsert content block |
| GET | `/v1/platform/admin/media` | List media assets |
| DELETE | `/v1/platform/admin/media/:id` | Delete media asset |
| GET | `/v1/platform/admin/analytics` | Dashboard metrics |

## CMS Slot Types

| Section | Description |
|:---|:---|
| `HERO_SLIDE` | Homepage hero carousel slides |
| `FEATURED_BANNER` | Featured content banners |
| `LOGO_STRIP` | Partner/client logos |
| `PORTFOLIO_ITEM` | Portfolio showcase items |
| `CTA_BAND` | Call-to-action bands |

See [Admin API Reference](/api/platform/admin) for request/response schemas.
