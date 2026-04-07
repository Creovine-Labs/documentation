---
sidebar_position: 3
title: Console
description: The Creovine developer console at console.creovine.com.
---

# Console

The **Creovine Console** at `console.creovine.com` is the authenticated dashboard for managing your products, licenses, and account.

## Access

- **URL**: `https://console.creovine.com`
- **Auth**: Email/password or Google OAuth
- **Account ID**: Format `CRV-XXXXXX` (6 alphanumeric characters)

## Features

| Section | Description |
|:---|:---|
| **Dashboard** | Product catalog grid, account info, license overview |
| **Licenses** | View, activate, and manage product licenses |
| **Downloads** | Download SDKs, desktop apps, and other assets |
| **Billing** | Subscription management and usage billing |
| **Products** | Per-product detail pages and configuration |

## Admin Panel

Users with `ADMIN` or `SUPER_ADMIN` roles get access to the admin panel:

| Feature | Required Role |
|:---|:---|
| User management | ADMIN+ |
| Analytics dashboard | ADMIN+ |
| CMS management | ADMIN+ |
| Product CRUD | ADMIN+ |
| Promote/demote admins | SUPER_ADMIN |

## Domain Architecture

| Domain | Purpose |
|:---|:---|
| `creovine.com` | Marketing site (public) |
| `console.creovine.com` | User console (authenticated) |
| `api.creovine.com` | Backend API |

Middleware performs host-based redirects: `/sign-in`, `/sign-up`, `/dashboard`, and `/admin` routes are redirected to the console subdomain. Auth tokens are stored in `crv_token` cookie/localStorage, shared across `.creovine.com`.
