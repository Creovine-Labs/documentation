---
sidebar_position: 2
title: Products
description: Product catalog and lifecycle management on the Creovine platform.
---

# Product Catalog

The platform maintains a product catalog accessible via the public API and the admin console.

## Current Products

| Product | Status | Type | Route Prefix |
|:---|:---|:---|:---|
| **CVault** | Live | APP | `/cvault/v1` |
| **Lira AI** | Beta | APP | `/lira/v1` |
| **EditCore** | In Development | SDK | Flutter plugin (license validation only) |

## Product Model

Each product record includes:

```json
{
  "id": "uuid",
  "slug": "cvault",
  "name": "CVault",
  "tagline": "Privacy-first VPN built on WireGuard",
  "type": "APP",
  "status": "LIVE",
  "isFeatured": true,
  "features": [...],
  "plans": [...],
  "downloads": [...],
  "versions": [...]
}
```

**Product types**: `SDK`, `API`, `APP`

**Product statuses**: `DRAFT` → `COMING_SOON` → `BETA` → `LIVE` → `DEPRECATED`

## Related Models

| Model | Relationship |
|:---|:---|
| `ProductVersion` | Version history per product |
| `ProductFeature` | Feature list per product |
| `ProductPlan` | Pricing plans per product |
| `ProductDoc` / `DocSection` | Documentation pages per product |
| `ProductMedia` | Screenshots, videos |
| `ProductDownload` | Downloadable assets (SDK, desktop app) |

## Public API

Product catalog endpoints are unauthenticated:

```bash
# List all published products
GET /v1/products?type=SDK|API|APP

# Get product detail (tracks view event)
GET /v1/products/:slug

# Product documentation
GET /v1/products/:slug/docs
GET /v1/products/:slug/docs/:docSlug
```

See [Product Catalog API](/api/platform/products) for full reference.
