---
sidebar_position: 3
title: Secrets Management
description: AWS Secrets Manager configuration and secrets loading.
---

# Secrets Management

Production secrets are loaded from **AWS Secrets Manager** at startup — never from `.env` files on the server.

## How It Works

```
loadSecretsFromAWS()   →   fills process.env from all secret paths
validateConfig()       →   validates all required vars (Zod schema)
fastify = Fastify()    →   server created after config is valid
```

:::info Lazy Config
`src/config/index.ts` exports a Proxy that **throws** if accessed before `validateConfig()` runs. This prevents any service from reading config at module-load time before secrets are populated.
:::

## Secret Paths

| Path | Contains |
|:---|:---|
| `/creovine/shared` | `JWT_SECRET`, `DATABASE_URL` |
| `/creovine/api` | `NODE_ENV`, `PORT`, `LOG_LEVEL`, `CORS_ORIGIN`, `ADMIN_SECRET`, encryption keys |
| `/cvault` | WireGuard server config, SSH credentials, encryption keys |
| `/lira` | DynamoDB tables, Bedrock config, OpenAI/Deepgram/Resend keys, OAuth credentials, Qdrant URL |
| `/creovine/rds` | RDS master credentials (ops only) |

## Local Development

In local dev, `.env` overrides take precedence. The secrets loader skips values already present in `process.env`:

```bash
# .env (local only — not committed)
DATABASE_URL=postgresql://creovine:devpassword@localhost:5433/creovine?schema=public
NODE_ENV=development
```

AWS secrets are still loaded via your local AWS CLI profile (`creovine-admin`).

## Updating Secrets

```bash
# Fetch current value
aws secretsmanager get-secret-value \
  --secret-id /cvault \
  --query SecretString \
  --output text > /tmp/s.json

# Edit the JSON file
vim /tmp/s.json

# Upload updated value
aws secretsmanager put-secret-value \
  --secret-id /cvault \
  --secret-string file:///tmp/s.json

# Restart the API to pick up changes
ssh -i ~/.ssh/creovine-api-key.pem ubuntu@98.92.255.171
sudo systemctl restart creovine-api
```

## Key Environment Variables

| Variable | Secret Path | Description |
|:---|:---|:---|
| `DATABASE_URL` | `/creovine/shared` | PostgreSQL connection string |
| `JWT_SECRET` | `/creovine/shared` | JWT signing secret |
| `ADMIN_SECRET` | `/creovine/api` | Admin API key |
| `OPENAI_API_KEY` | `/lira` | OpenAI GPT-4o-mini |
| `DEEPGRAM_API_KEY` | `/lira` | Deepgram Nova-2 |
| `RESEND_API_KEY` | `/lira` | Outbound email |
| `QDRANT_URL` | `/lira` | Vector DB |

See the [full environment variables reference](/getting-started/concepts) for the complete list.
