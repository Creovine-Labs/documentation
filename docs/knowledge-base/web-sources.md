---
slug: /knowledge-base/web-sources
sidebar_position: 4
title: Web Sources
description: Crawl and index your website or any public URL so Lira can reference web content during meetings and queries.
---

# Web Sources

The **Web Sources** tab lets you crawl any public website and index its content into the Knowledge Base. Lira will visit each page, extract the text, and embed it — making the site's content searchable alongside your documents and connected sources.

**Path:** Sidebar → Grow → Knowledge Base → **Web Sources**

---

## When to use Web Sources

Web Sources are best for **publicly available content** that represents your organisation or product:

- Your company website (`https://yourcompany.com`)
- Your product documentation site
- Your public help centre or FAQ pages
- A partner or vendor site you want Lira to reference

:::info Internal documents first
For **internal knowledge** — policies, specs, playbooks — use [Documents](/knowledge-base/documents) or [Connected Sources](/knowledge-base/connected-sources). Web crawling is best suited to content that is already published publicly.
:::

---

## Starting a crawl

1. Go to **Sidebar → Grow → Knowledge Base → Web Sources**
2. Enter the **starting URL** in the URL field (e.g. `https://yourdomain.com`)
3. Set **Product / segment tags**. Use `all` for shared pages, or tags such as
   `personal`, `business`, `corporate`, or a region name for scoped content.
4. Set the **Max Pages** limit — how many pages Lira will visit before stopping (default 20, maximum 50)
5. Click **Crawl**

Lira will begin crawling from the URL you provided, following internal links to discover and index pages.

---

## Max Pages

The **Max Pages** setting controls how deeply Lira crawls. A few guidelines:

| Pages | Good for |
|-------|---------|
| 5–10 | A small product landing site or focused help section |
| 20 (default) | A medium company site with core pages |
| 50 | A large docs site or multi-section knowledge base |

:::tip
Start with a lower limit to see what gets indexed, then increase if you need more coverage.
:::

---

## Crawl status

Once started, the status banner shows real-time progress:

| Status | Meaning |
|--------|---------|
| **Crawling in progress** | Lira is actively visiting pages — shows pages crawled so far |
| **Completed** | All pages were indexed successfully — total page count shown |
| **Failed** | The crawl encountered an error — the error message is displayed |

Crawling is asynchronous — you can navigate away and come back. The status will reflect the latest state when you return.

---

## Indexed pages list

Below the crawl controls, all indexed pages are listed. For each page you can see:

- **Title** — the page title extracted from the HTML
- **Category** — auto-detected category (`about`, `product`, `docs`, `blog`, `other`)
- **Source URL** — click the link to open the original page
- **Product / segment tags** — which support sessions may retrieve the page
- **Embedding count** — how many vector embeddings were created from the page

You can edit a page's tags from the row. Updating tags also updates the indexed
chunks used by the AI.

---

## Deleting indexed pages

### Delete a single page

Click the **Trash** icon on the right side of any page row. This removes the page and all its embeddings from the Knowledge Base.

### Clear all indexed pages

Click **Clear All** at the top-right of the indexed pages list. A confirmation dialog will appear. This removes all crawled pages — but does not affect uploaded documents or connected sources.

:::caution
Clearing web sources cannot be undone. You will need to re-crawl to restore the content.
:::

---

## Re-crawling to refresh content

Lira does not automatically re-crawl. If your website content changes, enter the
URL again and click **Crawl** — there is no need to clear anything first.

A crawl **updates the pages it fetches and leaves the rest alone**, so you can
refresh a single page without touching the others. Pages that come back keep the
product tags and priority you gave them, matched by URL.

Use **Clear All** only when you want the crawled knowledge base emptied — for
example when pages have been deleted from your site and should disappear from
Lira too.

---

## Frequently asked questions

**Can I crawl a competitor's website?**  
Technically yes, if the site is publicly accessible. Make sure you are allowed to access and use the content under the site's terms of service.

**Will Lira crawl password-protected pages?**  
No. The crawler only accesses pages that are publicly visible without authentication.

**My site uses JavaScript rendering — will it work?**  
The crawler fetches static HTML. Pages that require JavaScript to render their content may not be indexed correctly.

**Can I crawl multiple websites?**  
Yes — run the crawl for each URL separately. Each crawl adds to (rather than replaces) your existing indexed pages, unless you clear first.

**How long does a crawl take?**  
Typically a few minutes for 20 pages. Larger crawls may take longer depending on page size and site structure.
