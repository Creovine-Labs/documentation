---
sidebar_position: 1
title: Overview
description: Lira AI — autonomous AI workforce for meetings, interviews, sales coaching, and customer support.
---

# Lira AI

**Lira AI** is an AI workforce platform — autonomous AI agents that join meetings, conduct interviews, coach sales reps, and handle customer support.

## Product Areas

<div className="product-grid">
  <a className="feature-card" href="/lira/meetings">
    <h3>🎙️ Meetings</h3>
    <p>Lira joins Google Meet as a real participant. She listens, responds by name, captures action items, and generates summaries.</p>
  </a>
  <a className="feature-card" href="/lira/interviews">
    <h3>📋 Interviews</h3>
    <p>Fully autonomous AI interviews with structured questions, resume parsing, and scored evaluation reports.</p>
  </a>
  <a className="feature-card" href="/lira/sales-coaching">
    <h3>💼 Sales Coaching</h3>
    <p>Real-time objection handling, battle cards, and CRM auto-fill during sales calls.</p>
  </a>
  <a className="feature-card" href="/lira/customer-support">
    <h3>📧 Customer Support</h3>
    <p>AI email support grounded in your org's knowledge base with automatic escalation.</p>
  </a>
</div>

## Status

| Property | Value |
|:---|:---|
| **Status** | Beta |
| **Route prefix** | `/lira/v1` |
| **Frontend** | `https://lira.creovine.com` |
| **Backend** | `https://api.creovine.com/lira/v1` |

## Tech Stack

| Layer | Technology |
|:---|:---|
| Frontend | React 19 + Vite 7 + TypeScript + Zustand 5 |
| Backend | TypeScript / Fastify 4.x (shared `creovine-api`) |
| Speech AI | Amazon Nova Sonic v1:0 (speech-to-speech) |
| Text AI | OpenAI GPT-4o-mini |
| Diarization | Deepgram Nova-2 |
| Bot | Playwright 1.58 Chromium (headless) |
| DB | AWS DynamoDB (4 tables) |
| Vector Search | Qdrant (self-hosted on EC2) |
| Email | Resend (outbound) + AWS SES/SNS (inbound) |

## 9 Integrations

Linear, Slack, Microsoft Teams, Google Calendar, Google Drive, GitHub, Greenhouse, HubSpot, Salesforce — all with OAuth flows, member mapping, and bidirectional data sync.

## Quick Links

- [Quickstart →](/lira/quickstart)
- [Architecture →](/lira/architecture/audio-pipeline)
- [API Reference →](/api/lira/bot)
- [Integrations →](/lira/integrations/overview)
