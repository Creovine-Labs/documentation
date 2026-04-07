---
slug: /knowledge-base/query
sidebar_position: 5
title: Query
description: Ask questions and get AI-generated answers grounded in your Knowledge Base — documents, connected sources, and indexed web pages.
---

# Query

The **Query** tab is where your Knowledge Base pays off. Ask any question and Lira will search across everything you've indexed — documents, connected sources, and crawled web pages — and generate a grounded, source-cited answer.

**Path:** Sidebar → Workspace → Knowledge Base → **Query**

---

## How it works

Query uses **Retrieval-Augmented Generation (RAG)**:

1. You type a question
2. Lira runs a **semantic search** across all indexed content — finding the chunks most relevant to your question, even if they don't use the exact same words
3. The retrieved chunks are assembled into a **context block** and sent to the AI model alongside your question
4. The AI generates an answer using **only the content you've provided** — it does not guess or use general knowledge beyond your data
5. **Source citations** are shown below each answer so you know exactly where the information came from

---

## Asking questions

Type your question in the input box at the bottom of the Query tab and press **Enter** (or click the send button).

The conversation is **multi-turn** — Lira remembers the previous messages in the session, so you can ask follow-up questions naturally:

> **You:** What is our refund policy?  
> **Lira:** *[finds and explains the refund policy from your uploaded policy doc]*  
> **You:** Does that apply to enterprise customers too?  
> **Lira:** *[follows up using the same context]*

---

## Source citations

Every AI response shows source badges below the answer text. Each badge shows:

- Whether the source is a **Document** (uploaded file or connected source import) or a **Web Page** (crawled URL)
- The name of the document or page title

Click through to the original source in the Documents tab or on the web.

---

## Suggested questions

When no messages have been sent yet, the Query tab shows a few suggested question prompts. Click any suggestion to pre-fill it in the input — then edit or send as-is.

---

## "Not enough information" responses

If Lira cannot find relevant content in your Knowledge Base for a question, it will say so rather than make something up:

> *"I don't have enough information in the knowledge base to answer this question accurately."*

This means one of two things:
1. **The content hasn't been added yet** — go to Documents, Connected Sources, or Web Sources and add the relevant material
2. **The question is too specific** — try rephrasing or asking a broader version first

---

## Query tab is empty / disabled

The Query tab requires at least one indexed source to work. If you haven't uploaded any documents, connected any sources, or crawled any web pages, you will see a message directing you to add content first.

---

## Good questions to ask

**About your organisation:**
- "What is our return and refund policy?"
- "What are the key features of [Product Name]?"
- "Summarise our Q3 OKRs"

**About processes:**
- "What is the onboarding process for new engineers?"
- "What are the steps to submit an expense claim?"
- "How do we handle customer escalations?"

**Research and reference:**
- "Find everything we have about competitor X"
- "What did we learn from last quarter's customer interviews?"
- "What does our compliance policy say about data retention?"

---

## Limitations

- **Session-only memory** — the conversation history is only kept for the current browser session. Refreshing the page starts a fresh conversation.
- **No cross-session continuity** — past query sessions are not saved.
- **Only your data** — Lira will not use general AI knowledge to fill in gaps. If the information is not in your Knowledge Base, it will say so.
- **Language and format** — Lira performs best on English-language content that is well-structured and clearly written.
