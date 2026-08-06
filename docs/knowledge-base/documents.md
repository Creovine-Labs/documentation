---
slug: /knowledge-base/documents
sidebar_position: 2
title: Documents
description: Upload files directly to feed Lira's knowledge — supported formats, size limits, and how processing works.
---

# Documents

The **Documents** tab is the most direct way to put knowledge into Lira. Upload any file from your computer and Lira will read, chunk, embed, and index it — making the content searchable and available as context in every session.

**Path:** Sidebar → Grow → Knowledge Base → **Documents**

---

## Uploading documents

### Drag and drop

Drag one or more files from your file browser and drop them onto the upload zone on the Documents tab. The upload begins immediately.

### Browse and select

Click **Browse** inside the upload zone to open your system file picker. You can select multiple files at once.

Once uploaded, each file appears in the document list below with a status badge showing its processing stage.

### Product / segment tags

If one workspace supports multiple products, brands, or regions, add tags before
uploading. Use comma-separated values such as:

- `all` for shared content that applies to every customer
- `personal`, `business`, `corporate` for product-specific content
- `nigeria`, `rwanda`, `ghana` for region-specific policies

Lira uses these tags during retrieval. A support session with
`productType: "personal"` searches `personal` plus shared tags like `all`; it
does not search `business` or `corporate` documents.

You can edit a document's tags from the document row after upload. Updating tags
also updates the indexed chunks used by the AI. If the index cannot be updated
the change is rejected with an error rather than saved — a document must never
show one scope in the dashboard while retrieval enforces another.

### What happens to documents you never tagged

**By default, an untagged document answers every product.** This keeps tagging
additive: turning segmentation on cannot silently empty a knowledge base built
before tags existed, and you can tag content gradually instead of in one pass.

Once everything is tagged, tick **Only answer from tagged documents** (on the
Documents panel) to make it a control rather than a convention:

| Setting | An untagged document is… | A forgotten tag causes… |
| --- | --- | --- |
| Off (default) | used for every product | the old behaviour: a possible wrong-product answer |
| On | used for nobody on a known product | "I don't have that information" — a visible gap |

For regulated content this is the setting you want, because it converts a silent
wrong answer into an obvious missing one. Turn it on **after** tagging: it takes
every untagged document out of service at once.

Sessions that name no product are unaffected either way — they search
everything, as before.

:::note Where the product comes from matters
When the session was minted by your backend (a signed support session), Lira
takes the product from that token and the browser cannot change it. Context sent
from the page later can refine what the AI knows, but it cannot widen which
documents are searched. For anonymous visitors there is no signed session, so
the page's value is the only signal available — treat segmentation as a
correctness control for identified customers, and as best-effort routing for
anonymous ones.
:::

---

## Supported file types

| Format | Extension |
|--------|-----------|
| Word Document | `.docx`, `.doc` |
| Plain Text | `.txt` |
| Markdown | `.md` |
| CSV | `.csv` |
| Excel Spreadsheet | `.xlsx` |

The upload picker accepts exactly these types (`.docx,.doc,.txt,.md,.csv,.xlsx`). **PDFs are not supported at all** — not as direct uploads, and not through Connected Sources either. PDFs are frequently image-based and extract into text too poor to answer from, so Lira rejects them rather than indexing unusable content. Convert the file to Word, Markdown or text first. You can also **Write a note directly** in the Documents tab instead of uploading a file.

:::info Maximum file size
Files must be **25 MB or smaller**. If your file is larger, consider splitting it or converting it to a more compact format (e.g., save a large Word file as plain text).
:::

---

## Processing statuses

After uploading, a document moves through these states:

| Status | Meaning |
|--------|---------|
| **Uploaded** | File received, waiting to be processed |
| **Processing** | Lira is reading the file, splitting it into chunks, and creating embeddings |
| **Indexed** | Ready — Lira can now retrieve content from this document |
| **Failed** | Processing encountered an error |

Processing typically takes a few seconds for small files and up to a couple of minutes for large spreadsheets or documents. The list auto-refreshes every 5 seconds while processing is in progress.

### If a document fails

Click the **Reprocess** button (circular arrow icon) next to the failed document. If it fails again, the file may be corrupted or in an unsupported encoding — try re-exporting it.

---

## Managing documents

### Download

Click the **Download** icon on any document row to get the original file back.

### Delete

Click the **Trash** icon to permanently remove the document. This also removes all embeddings for that file — Lira will no longer have access to its content.

:::caution
Deleting a document cannot be undone. If you're unsure, download it first.
:::

---

## What kinds of documents should I upload?

Upload anything that represents how your organisation thinks and works:

- **Company policies** — HR policies, codes of conduct, compliance documents
- **Product documentation** — feature specs, API references, FAQs, release notes
- **Onboarding materials** — training guides, SOPs, role playbooks
- **Strategy documents** — OKRs, roadmaps, pitch decks
- **Research** — market research, competitor analysis, customer interview summaries

The more relevant content you upload, the more accurate and contextual Lira's responses become.

---

## Document stats

At the top of the Documents tab you'll see two counters:

- **Total Files** — how many documents have been uploaded
- **Indexed** — how many are fully processed and available to Lira

If Total Files and Indexed are out of sync, some documents are still processing or have failed.
