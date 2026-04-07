---
slug: /knowledge-base/documents
sidebar_position: 2
title: Documents
description: Upload files directly to feed Lira's knowledge — supported formats, size limits, and how processing works.
---

# Documents

The **Documents** tab is the most direct way to put knowledge into Lira. Upload any file from your computer and Lira will read, chunk, embed, and index it — making the content searchable and available as context in every session.

**Path:** Sidebar → Workspace → Knowledge Base → **Documents**

---

## Uploading documents

### Drag and drop

Drag one or more files from your file browser and drop them onto the upload zone on the Documents tab. The upload begins immediately.

### Browse and select

Click **Browse** inside the upload zone to open your system file picker. You can select multiple files at once.

Once uploaded, each file appears in the document list below with a status badge showing its processing stage.

---

## Supported file types

| Format | Extension |
|--------|-----------|
| PDF | `.pdf` |
| Word Document | `.docx`, `.doc` |
| Plain Text | `.txt` |
| Markdown | `.md` |
| CSV | `.csv` |
| Excel Spreadsheet | `.xlsx` |

:::info Maximum file size
Files must be **50 MB or smaller**. If your file is larger, consider splitting it or converting it to a more compact format (e.g., save a large Word file as plain text).
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

Processing typically takes a few seconds for small files and up to a couple of minutes for large PDFs. The list auto-refreshes every 5 seconds while processing is in progress.

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
