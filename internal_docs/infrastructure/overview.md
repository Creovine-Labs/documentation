---
slug: /infrastructure/overview
sidebar_position: 1
title: Infrastructure Overview
---

# Infrastructure Overview

Lira AI runs on AWS with the frontend hosted on Vercel.

## Resource Map

| Resource | Purpose |
|:---|:---|
| **AWS EC2** (t3.small) | Backend server — Fastify, Playwright, audio processing |
| **AWS DynamoDB** | Meeting sessions, transcripts, organizations, interviews |
| **AWS S3** | Audio recordings, documents, resumes, email storage |
| **AWS SES** | Inbound email receipt for the reply engine |
| **AWS SNS** | Notification bridge (SES → webhook) |
| **AWS Secrets Manager** | Database credentials and shared secrets |
| **AWS Bedrock** | Nova Sonic inference |
| **Qdrant** (Docker on EC2) | Vector database for knowledge base embeddings |
| **Vercel** | Frontend hosting |
| **Namecheap** | DNS management |
| **nginx** | Reverse proxy + SSL termination (Let's Encrypt) |
| **systemd** | Process management (creovine-api.service) |

## DynamoDB Tables

| Table | Purpose |
|:---|:---|
| `lira-meetings` | Meeting sessions + transcripts |
| `lira-connections` | User connections + OAuth tokens |
| `lira-organizations` | Org profiles, members, settings |
| `lira-interviews` | Interview sessions + evaluations |

## S3 Buckets

| Bucket | Purpose |
|:---|:---|
| `creovine-lira-documents` | Organization document uploads |
| `lira-documents-storage` | Candidate resumes |
| `lira-inbound-email` | Raw inbound email storage |

## External APIs

| Service | Purpose | Pricing Model |
|:---|:---|:---|
| OpenAI GPT-4o-mini | Summaries, evaluations, parsing | Pay-per-token |
| Deepgram Nova-2 | Speaker diarization | $0.0059/min |
| Resend | Outbound email | Per-email pricing |
| AWS Bedrock (Nova Sonic) | Speech-to-speech AI | Per-inference |
