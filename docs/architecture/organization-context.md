---
slug: /architecture/organization-context
sidebar_position: 6
title: Organization Context System
---

# Organization Context System

The Organization Context System gives Lira deep knowledge about your company — so she can give informed, relevant responses during meetings instead of generic AI answers.

## Architecture

The system is built across 9 phases:

### Phase 1: Organization CRUD & Membership

Basic organization management — create, update, delete orgs, invite members, manage roles.

### Phase 2: Organization Profile & Context Injection

Organization profile data (name, industry, description, values) is injected into Nova Sonic's system prompt at session start.

### Phase 3: Website Crawl & Knowledge Base

Lira crawls your company website using Crawlee + Cheerio, extracts text content, and indexes it for retrieval.

### Phase 4: Document Upload, Parsing & RAG Pipeline

Upload PDFs, DOCX, and text files. Content is extracted, chunked, and prepared for embedding:

- **pdf-parse** for PDF extraction
- **mammoth** for DOCX conversion
- Custom chunking with overlap for context preservation

### Phase 5: Vector Search & Semantic Retrieval

Content chunks are embedded using **OpenAI text-embedding-3-small** (1536 dimensions) and stored in **Qdrant** (self-hosted on EC2):

```
Document → Chunks → OpenAI Embeddings → Qdrant Collection
                                              │
Meeting question → Embedding → Cosine Search ─┘
                                              │
                              Top-K relevant passages
```

### Phase 6: Context Injection into Nova Sonic

During a meeting, when Lira is about to respond:

1. Recent transcript is embedded
2. Vector search finds the most relevant knowledge base passages
3. Passages are injected into Nova Sonic's context (token-aware, with caching)
4. Mid-meeting context refresh keeps the context current

### Phase 7: Task Execution Engine

Tasks extracted from meetings go through an AI execution pipeline:

1. **Extraction** — GPT-4o-mini identifies action items
2. **Review** — Lira validates tasks (`lira_review_status`)
3. **Execution** — Tasks are created in connected tools (Linear, GitHub, etc.)
4. **Notification** — Webhook and Slack notifications confirm execution

## Data Model

```typescript
interface Organization {
  orgId: string;
  name: string;
  industry: string;
  description: string;
  website: string;
  members: OrgMember[];
  integrations: Integration[];
  knowledgeBase: KnowledgeDocument[];
  usageQuota: UsageQuota;
}
```

## Security & Data Isolation

- All knowledge base content is scoped to the organization
- Vector search queries are filtered by `orgId`
- No cross-organization data leakage
- Documents are stored in S3 with organization-prefixed keys
