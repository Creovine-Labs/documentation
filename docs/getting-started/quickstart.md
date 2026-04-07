---
sidebar_position: 2
title: Quickstart
description: Set up the Creovine platform backend locally for development.
---

# Quickstart

Get the Creovine backend running locally in 5 minutes.

## Prerequisites

- **Node.js** 20+
- **Docker Desktop** (for local PostgreSQL)
- **AWS CLI** configured with `creovine-admin` IAM credentials
- **Git**

## Clone & Install

```bash
git clone https://github.com/Creovine-Labs/creovine-api
cd creovine-api
npm install
```

## Start Local Database

```bash
docker run -d --name local-postgres \
  -e POSTGRES_USER=creovine \
  -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=creovine \
  -p 5433:5432 postgres:16-alpine
```

## Configure Environment

The app loads secrets from **AWS Secrets Manager** automatically via `src/utils/secrets.ts`. For local development, override the database URL:

```bash
echo 'DATABASE_URL=postgresql://creovine:devpassword@localhost:5433/creovine?schema=public' > .env
echo 'NODE_ENV=development' >> .env
```

:::info
AWS secrets (`JWT_SECRET`, `ADMIN_SECRET`, integration credentials, etc.) are loaded automatically using your local AWS CLI profile. You only need `.env` for `DATABASE_URL`.
:::

## Run Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

## Start the Server

```bash
npm run dev
```

The API is now available at:
- **API**: `http://localhost:3000`
- **Swagger**: `http://localhost:3000/docs`
- **Health check**: `http://localhost:3000/health`

## Verify

```bash
curl http://localhost:3000/health
# {"status":"ok","timestamp":"2026-03-29T..."}
```

## Next Steps

- [Authentication →](/getting-started/authentication) — understand the 3-layer auth model
- [Concepts →](/getting-started/concepts) — platform design principles
- [API Reference →](/api/platform/auth) — explore all endpoints
