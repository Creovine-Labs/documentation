---
sidebar_position: 1
title: Releases
description: Creovine platform release notes and changelog.
---

# Changelog

## March 2026

### 2026-03-29 — Lira AI Major Update

**New Features:**
- **Organization Context System** — Orgs, knowledge base (website crawl via Crawlee + Qdrant vector search), document upload with RAG
- **AI-Conducted Interviews** — Solo, Copilot, and Shadow modes with auto-scheduler, resume parsing, and 2-phase evaluation
- **Email Integration** — Resend outbound + AWS SES/SNS inbound reply engine with custom domain support
- **Customer Support AI** — AI email replies grounded in org knowledge base with automatic escalation
- **9 Third-Party Integrations** — Linear, Slack, Microsoft Teams, Google Calendar & Drive, GitHub, Greenhouse, HubSpot, Salesforce
- **Deepgram Nova-2** speaker diarization with DOM-based name correlation
- **Usage Tracking & Quotas** — Per-org usage dashboard with beta limit enforcement
- **Dual Google OAuth** — Separate client IDs for app login vs. Calendar/Drive integration

**Infrastructure:**
- EC2 Elastic IP changed to `98.92.255.171`
- Added DynamoDB tables: `lira-organizations`, `lira-interviews`
- Added S3 buckets: `creovine-lira-documents`, `lira-documents-storage`, `lira-inbound-email`
- Added Qdrant vector DB (Docker on EC2)
- Switched summary generation from Bedrock Nova Lite to OpenAI GPT-4o-mini

---

## February 2026

### 2026-02-27 — Platform Migration

**Infrastructure:**
- Migrated production server from AWS Lightsail (`44.208.117.166`) to EC2 `t3.small`
- Replaced Docker PostgreSQL with AWS RDS PostgreSQL 16
- Lira AI backend migrated from Go serverless (Lambda + API Gateway) to TypeScript in `creovine-api` at `/lira/v1`
- Config architecture changed to lazy Proxy + `validateConfig()` — secrets loaded from AWS before validation
- SSL certificates issued for `api.creovine.com` and `cvault.creovine.com` via Let's Encrypt

---

## January 2026

### CVault VPN — v1.0 Launch

- Device registration with WireGuard key pair generation
- VPN connect/disconnect with session management
- License validation with 4 plan tiers (Trial, Starter, Pro, Enterprise)
- JavaScript/TypeScript SDK (`@creovine/cvault-sdk`)
- Flutter Desktop App for macOS and Windows
- Multi-device support (iOS, Android, Windows, macOS, Linux)

### Creovine Platform — v1.0

- Multi-tenant architecture with Fastify 4.x
- JWT authentication with refresh tokens
- Admin API for tenant and API key management
- Product catalog and CMS
- AWS Secrets Manager integration
