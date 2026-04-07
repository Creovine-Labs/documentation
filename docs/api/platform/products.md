---
sidebar_position: 3
title: Products
description: Product catalog API — list and manage products.
---

# Products API

**Base URL:** `https://api.creovine.com/products`

## Endpoints

### List Products

```http
GET /products
```

**Response** `200 OK`:
```json
{
  "products": [
    {
      "id": "uuid",
      "slug": "cvault-vpn",
      "name": "CVault VPN",
      "type": "service",
      "status": "live",
      "description": "Enterprise VPN service",
      "features": [...],
      "plans": [...]
    }
  ]
}
```

### Get Product

```http
GET /products/:slug
```

### Create Product (Admin)

```http
POST /admin/products
X-Admin-Key: <admin-secret>

{
  "slug": "new-product",
  "name": "New Product",
  "type": "service",
  "status": "development",
  "description": "Product description"
}
```

### Update Product (Admin)

```http
PATCH /admin/products/:productId
X-Admin-Key: <admin-secret>

{
  "status": "live",
  "description": "Updated description"
}
```
