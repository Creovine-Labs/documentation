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

## test-lira-ai.mjs

Tests the AI from a customer's perspective, in the terminal — no widget needed:

```bash
node scripts/test-lira-ai.mjs
```

Each case asserts on the **answer**: `expect` phrases must appear, `forbid`
phrases must not. The `forbid` list is what catches regressions — e.g. the AI
inventing a mobile SDK, gating signup behind a demo, or claiming a plan includes
localized voice. Exits non-zero on failure, so it can gate a release.

Add a case whenever a wrong answer is found in the wild, so it can't come back.
