---
sidebar_position: 5
title: Organization Context
description: Knowledge base, document uploads, and Qdrant vector search for RAG.
---

# Organization Context

Organizations are the multi-tenant unit within Lira. Each org has members, a knowledge base, documents, tasks, and integration connections. The knowledge base powers contextual AI responses via RAG (Retrieval-Augmented Generation).

## Knowledge Base Sources

### Website Crawl

Trigger a crawl of your organization's website:

```bash
POST /lira/v1/orgs/:orgId/kb/crawl
Authorization: Bearer <jwt>

{
  "url": "https://yourcompany.com"
}
```

**Crawlee** scrapes the website, summarises each page, and stores entries in DynamoDB + embeds them in **Qdrant** for vector search.

### Document Upload

Upload PDFs and DOCX files to the org knowledge base:

```bash
POST /lira/v1/orgs/:orgId/documents
Content-Type: multipart/form-data
Authorization: Bearer <jwt>
```

Documents are parsed (`pdf-parse` for PDFs, `mammoth` for DOCX), chunked, and embedded in Qdrant. Raw files are stored in S3 (`creovine-lira-documents`).

## Context Injection

Before Nova Sonic responds during a meeting, `lira-context-builder.service.ts`:

1. Takes the current conversation context
2. Performs a **vector similarity search** against the org's Qdrant collection
3. Retrieves the top-K most relevant knowledge base entries
4. Injects them into the system prompt

This ensures Lira's responses are grounded in your company's actual products, documentation, and competitive positioning.

## Data Storage

| Data | Storage |
|:---|:---|
| Org metadata, members, KB entries | DynamoDB `lira-organizations` (`PK: ORG#<orgId>`, `SK: <type>#<id>`) |
| Uploaded documents (raw files) | S3 `creovine-lira-documents` |
| Vector embeddings | Qdrant (self-hosted on EC2 via Docker) |

## API Reference

```bash
# List knowledge base entries
GET /lira/v1/orgs/:orgId/kb

# List uploaded documents
GET /lira/v1/orgs/:orgId/documents

# Create a task
POST /lira/v1/orgs/:orgId/tasks
{ "title": "Follow up with client", "assignee": "userId" }

# List tasks (filterable)
GET /lira/v1/orgs/:orgId/tasks?status=open&assignee=userId
```
