---
sidebar_position: 2
title: AWS Services
description: All AWS services used by the Creovine platform.
---

# AWS Services

**AWS Account**: `814322375061` (`support@creovine.com`)
**IAM User**: `creovine-admin`
**Default region**: `us-east-1`

## Service Inventory

| Service | Usage |
|:---|:---|
| **EC2** | Production API server (`t3.small`, Elastic IP `98.92.255.171`) |
| **RDS** (PostgreSQL 16) | Managed production database (`creovine-postgres`) |
| **Secrets Manager** | All production secrets (5 paths) |
| **DynamoDB** | Lira AI — meetings, connections, organizations, interviews tables |
| **Bedrock** | `amazon.nova-sonic-v1:0` — bidirectional speech-to-speech streaming |
| **S3** (`creovine-lira-documents`) | Lira AI — org documents (PDFs, extracted text) |
| **S3** (`lira-documents-storage`) | Lira AI — candidate resume PDFs |
| **S3** (`lira-inbound-email`) | Lira AI — raw MIME emails from SES |
| **S3** (auth state bucket) | Lira AI — Google bot session backup |
| **SES** | Lira AI — inbound email receipt (`reply+*@liraintelligence.com`) |
| **SNS** | Lira AI — SES → SNS → Fastify webhook bridge |
| **IAM** | User `creovine-admin`, EC2 instance profile `creovine-api-profile` |

## External Services (non-AWS)

| Service | Product | Usage |
|:---|:---|:---|
| **OpenAI GPT-4o-mini** | Lira AI | Summaries, evaluation, question gen, email replies |
| **Deepgram Nova-2** | Lira AI | Real-time speaker diarization ($0.0059/min) |
| **Resend** | Lira AI | Transactional outbound email |
| **Qdrant** | Lira AI | Self-hosted vector DB on EC2 (Docker) for RAG |

## DynamoDB Tables

| Table | Product | Key Structure |
|:---|:---|:---|
| `lira-meetings` | Lira AI | `PK: USER#<userId>` |
| `lira-connections` | Lira AI | WebSocket connection tracking |
| `lira-organizations` | Lira AI | `PK: ORG#<orgId>, SK: <type>#<id>` |
| `lira-interviews` | Lira AI | `PK: ORG#<orgId>, SK: INT#<interviewId>` |

## S3 Buckets

| Bucket | Product | Purpose |
|:---|:---|:---|
| `creovine-lira-documents` | Lira AI | Org documents (PDFs, extracted text) |
| `lira-documents-storage` | Lira AI | Candidate resume PDFs |
| `lira-inbound-email` | Lira AI | Raw MIME emails from SES receipt rule |

## IAM Instance Profile

The EC2 instance runs with `creovine-api-profile` which grants:
- Secrets Manager read access
- DynamoDB full access (Lira tables)
- Bedrock invoke access
- S3 access (Lira buckets)
- SES send access
- SNS subscribe/receive
