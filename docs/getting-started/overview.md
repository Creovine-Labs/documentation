---
slug: /
sidebar_position: 1
title: Creovine Platform
description: Developer documentation for the Creovine multi-product platform — CVault VPN, Lira AI, and EditCore.
---

<div className="hero-crv">
  <h1>Creovine Developer Docs</h1>
  <p>Build with the Creovine platform — a unified backend powering CVault VPN, Lira AI, and EditCore. One API, multiple products.</p>
  <div className="hero-buttons">
    <a className="button button--primary button--lg" href="/getting-started/quickstart">Get Started →</a>
    <a className="button button--outline button--lg" href="/api/platform/auth">API Reference</a>
  </div>
</div>

---

## Products

<div className="product-grid">
  <a className="product-card" href="/cvault/overview">
    <span className="badge badge--live">Live</span>
    <h3>🔒 CVault VPN</h3>
    <p>White-label VPN-as-a-Service built on WireGuard. SDK, desktop app, and REST API for tenant-managed VPN infrastructure.</p>
  </a>
  <a className="product-card" href="/lira/overview">
    <span className="badge badge--beta">Beta</span>
    <h3>🤖 Lira AI</h3>
    <p>AI workforce platform — autonomous meeting participant, AI-conducted interviews, sales coaching, and customer support. 9 integrations.</p>
  </a>
  <a className="product-card" href="/editcore/overview">
    <span className="badge badge--dev">In Development</span>
    <h3>🎬 EditCore</h3>
    <p>Drop-in Flutter plugin for professional video editing — trim, crop, filters, text overlays, and hardware-accelerated export.</p>
  </a>
</div>

## Platform Architecture

Creovine uses a **shared backend** model. All products route through a single Fastify API at `api.creovine.com`, each isolated by route prefix:

```
https://api.creovine.com
├── /v1           → Platform (auth, admin, products, CMS)
├── /cvault/v1    → CVault VPN
├── /lira/v1      → Lira AI
└── /editcore     → EditCore (license validation only)
```

| Property | Value |
|:---|:---|
| **API Base URL** | `https://api.creovine.com` |
| **Swagger UI** | `https://api.creovine.com/docs` |
| **Console** | `https://console.creovine.com` |
| **Website** | `https://creovine.com` |
| **GitHub** | `https://github.com/Creovine-Labs` |

## Quick Links

<div className="feature-grid">
  <a className="feature-card" href="/getting-started/quickstart">
    <h3>⚡ Quickstart</h3>
    <p>Set up local development in 5 minutes.</p>
  </a>
  <a className="feature-card" href="/getting-started/authentication">
    <h3>🔑 Authentication</h3>
    <p>API keys, JWT tokens, and admin keys.</p>
  </a>
  <a className="feature-card" href="/api/platform/auth">
    <h3>📡 Platform API</h3>
    <p>Auth, admin, products, and CMS endpoints.</p>
  </a>
  <a className="feature-card" href="/infrastructure/overview">
    <h3>☁️ Infrastructure</h3>
    <p>AWS EC2, RDS, DynamoDB, and more.</p>
  </a>
</div>
