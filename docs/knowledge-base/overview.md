---
sidebar_position: 1
title: Knowledge Base Overview
description: How Lira learns about your organisation — what the Knowledge Base is, why it matters, and the four ways to feed it.
---

# Knowledge Base

The Knowledge Base is what Lira reads to answer your customers. Every PDF, doc, help center page, or KB article you add becomes part of what she knows — so her replies are grounded in your real product rather than generic AI knowledge.

---

## What is the Knowledge Base?

When a customer asks Lira a question — in the chat widget, on the support portal, or via a proactive nudge — she doesn't guess. She searches your Knowledge Base first, retrieves the most relevant snippets, and uses them as context for her reply.

Think of it as Lira's long-term memory for your organisation. Every document you upload, every source you connect, and every page you crawl becomes part of the pool of knowledge she draws from in every conversation.

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
3. **Semantic indexing** — each chunk is prepared for meaning-based retrieval
4. **Storage** — the vectors are stored in a vector database alongside the original text
5. **Retrieval** — when Lira needs context, it runs a semantic search against those vectors to find the most relevant chunks

This means Lira can find relevant information even when the exact words don't match — it understands meaning, not just keywords.

---

## Why it matters

Every customer conversation Lira handles draws on the Knowledge Base. A well-populated KB lets Lira:

- Answer product-specific questions accurately, in your terminology
- Cite real internal sources instead of paraphrasing generic AI knowledge
- Stay grounded so she escalates *only* when she truly doesn't know
- Reduce escalations to your team over time — every doc you add closes another category of "I have to open a ticket" question

A thin KB usually means a high escalation rate. The first hour you spend pointing Lira at your help center and dropping in your top 10 internal docs has the highest leverage of any setup step.

---

## Getting started

1. Go to **Sidebar → Grow → Knowledge Base**
2. Start with the **Documents** tab — upload your most important reference files (product specs, policies, onboarding docs)
3. Connect your **Google Drive** or **GitHub** if you want Lira to pull from those sources automatically
4. Optionally crawl your **website** to index public-facing content
5. Use the **Query** tab to test that Lira can find and use the information you've added
