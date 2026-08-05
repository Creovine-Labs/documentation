# Scripts

## refresh-lira-kb.mjs

Rebuilds the Lira org's knowledge base from this repo. Run after any docs change:

```bash
LIRA_EMAIL=you@example.com LIRA_PASSWORD='...' node scripts/refresh-lira-kb.mjs
```

Bundles `docs/**` plus `knowledge-extra/**` into one markdown document, replaces
the previous copy (so chunks never duplicate), and waits for indexing.

Add `--crawl` to also re-crawl liraintelligence.com. Note: a crawl **replaces**
all previously crawled pages — the platform holds one crawled site at a time.
Uploaded documents are unaffected by crawls.

`knowledge-extra/` is not published to the docs site — it is extra context
written specifically for the AI.
