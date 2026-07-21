---
slug: /infrastructure/aws-resources
sidebar_position: 3
title: AWS Resources
---

# AWS Resources

Detailed configuration of all AWS resources used by Lira.

## Account Information

| Property | Value |
|:---|:---|
| Account ID | 912921195732 |
| Primary Region | us-east-1 |
| EC2 Instance | t3.small |
| EC2 IP | 98.92.255.171 |
| OS | Ubuntu 22.04 |

## EC2 Instance

The backend runs on a single EC2 t3.small instance:

- **CPU**: 2 vCPUs (burstable)
- **RAM**: 2 GB
- **Storage**: EBS volume
- **Security Groups**: HTTP (80), HTTPS (443), SSH (22)
- **Elastic IP**: 98.92.255.171

### Installed Software

- Node.js 20+
- npm
- Chromium (for Playwright)
- Docker (for Qdrant)
- nginx (reverse proxy)
- certbot (SSL)

## DynamoDB

All tables use on-demand capacity mode:

### lira-meetings

| Key | Type | Description |
|:---|:---|:---|
| `meetingId` | String (PK) | Unique meeting identifier |
| `orgId` | String (GSI) | Organization scope |

### lira-organizations

| Key | Type | Description |
|:---|:---|:---|
| `orgId` | String (PK) | Unique org identifier |

### lira-connections

| Key | Type | Description |
|:---|:---|:---|
| `connectionId` | String (PK) | OAuth connection identifier |
| `orgId` | String (GSI) | Organization scope |

### lira-interviews

| Key | Type | Description |
|:---|:---|:---|
| `interviewId` | String (PK) | Unique interview identifier |
| `orgId` | String (GSI) | Organization scope |

## S3

### creovine-lira-documents (us-east-1)

Organization document uploads for the knowledge base:

```
s3://creovine-lira-documents/{orgId}/documents/{documentId}/{filename}
```

### lira-documents-storage

Candidate resumes and interview artifacts:

```
s3://lira-documents-storage/resumes/{interviewId}/{filename}
```

## Qdrant (Vector Database)

Self-hosted on EC2 as a Docker container:

```bash
docker run -d --restart always -p 6333:6333 qdrant/qdrant
```

- **Collection**: `lira_org_embeddings`
- **Distance**: Cosine
- **Dimensions**: 1536 (OpenAI text-embedding-3-small)
- **URL**: `http://localhost:6333` (internal only)
