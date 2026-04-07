---
slug: /knowledge-base
sidebar_position: 1
title: Knowledge Base Overview
description: How Lira learns about your organisation — what the Knowledge Base is, why it matters, and the four ways to feed it.
---

# Knowledge Base

The Knowledge Base is where Lira learns about your organisation. The more you put in, the smarter and more contextual Lira becomes — during meetings, interviews, and AI-assisted queries.

---

## What is the Knowledge Base?

When Lira joins a meeting or answers a question, it doesn't guess. It searches your Knowledge Base first — retrieving the most relevant information and using it as context for its responses.

Think of it as Lira's long-term memory for your organisation. Every document you upload, every source you connect, and every website you index becomes part of the pool of knowledge Lira draws from.

This technique is called **Retrieval-Augmented Generation (RAG)** — Lira finds the right facts before generating a response, so answers are grounded in your actual data rather than general AI knowledge.

---

## The Four Sections

The Knowledge Base is split into four tabs, each representing a different way to feed Lira information:

| Tab | What it does |
|-----|-------------|
| [**Documents**](/knowledge-base/documents) | Upload files directly — PDFs, Word docs, spreadsheets, markdown, and more |
| [**Connected Sources**](/knowledge-base/connected-sources) | Pull documents in from Google Drive or GitHub without manual uploads |
| [**Web Sources**](/knowledge-base/web-sources) | Crawl and index pages from your website or any public URL |
| [**Query**](/knowledge-base/query) | Ask questions and get AI answers grounded in everything you've indexed |

---

## How indexing works

Regardless of how content enters the Knowledge Base, it always goes through the same pipeline:

1. **Ingestion** — the raw file, URL, or API response is received
2. **Chunking** — the content is split into smaller segments
3. **Embedding** — each chunk is converted into a vector (a numerical representation of its meaning) using OpenAI's embedding model
4. **Storage** — the vectors are stored in a vector database alongside the original text
5. **Retrieval** — when Lira needs context, it runs a semantic search against those vectors to find the most relevant chunks

This means Lira can find relevant information even when the exact words don't match — it understands meaning, not just keywords.

---

## Why it matters for meetings

When you have a meeting with Lira present, it uses your Knowledge Base to:

- Understand your product, company, and terminology
- Answer participant questions accurately
- Produce summaries that reflect your internal language
- Extract tasks that reference the right projects and people

A well-populated Knowledge Base makes every Lira session significantly more useful.

---

## Getting started

1. Go to **Sidebar → Workspace → Knowledge Base**
2. Start with the **Documents** tab — upload your most important reference files (product specs, policies, onboarding docs)
3. Connect your **Google Drive** or **GitHub** if you want Lira to pull from those sources automatically
4. Optionally crawl your **website** to index public-facing content
5. Use the **Query** tab to test that Lira can find and use the information you've added
