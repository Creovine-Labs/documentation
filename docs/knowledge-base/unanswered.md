---
slug: /knowledge-base/unanswered
sidebar_position: 7
title: Unanswered questions
description: What customers asked that Lira could not answer — recorded automatically, grouped by question, and ranked by how many people asked.
---

# Unanswered questions

Whenever Lira cannot answer from your Knowledge Base, it records the question —
verbatim, as the customer typed it. This tab is that list.

It is the shortest path to knowing what content to write next, because it is not
a guess: it is what your customers actually asked and did not get an answer to.

**Path:** Sidebar → Grow → Knowledge Base → **Unanswered**

Nothing to switch on. Lira has been recording these since your workspace was
created, so the list may already have content in it the first time you open it.

---

## What each row tells you

| Column | Meaning |
|--------|---------|
| **Asked** | How many people asked this. The list is ranked by it — that is your writing order. |
| **Question** | The customer's wording, not a paraphrase. Useful in itself: it is how real people describe the problem. |
| **Why Lira missed it** | The agent's own note, e.g. "no pricing content in the knowledge base". |
| **Lira guessed** | What the agent thought the answer might be. Sometimes right, and a useful starting draft — always check it. |
| **Last asked** | When it last came up. |

Questions are grouped, so twenty people asking the same thing is **one row with
a count of 20**, not twenty rows. Wording and punctuation differences are
collapsed: "What are your fees?" and "what are your fees" are the same question.

## Closing one off

Once you have written the content, click **I've covered this**. That closes the
whole question, not one occurrence, and takes it off the list.

The list only ever grows if nothing is ever closed, and a list nobody trusts
stops being read — so close them as you write.

## Sandbox and production are separate

Questions from a sandbox integration stay out of the production list and vice
versa. Your team's own testing never pollutes the record of what real customers
asked.

---

## From the terminal

```bash
lira docs gaps                                # ranked, most-asked first
lira docs gaps --status=all                   # include ones already handled
lira docs gaps resolve --question="fees"      # close it once written
```

Handy as a standing check — a weekly run tells you what your knowledge base is
missing without anyone opening the dashboard.

## Over the API

```
GET   /orgs/{orgId}/kb/gaps        support:read     ?status=open|all&mode=test|live
PATCH /orgs/{orgId}/kb/gaps        support:write    { gap_ids: [...], status: "resolved" }
```

```bash
curl "https://api.creovine.com/lira/v1/orgs/org_xxx/kb/gaps?status=open" \
  -H "Authorization: Bearer $LIRA_API_KEY"
```

```json
{
  "gaps": [
    {
      "question": "How long does an international transfer take?",
      "count": 7,
      "first_asked": "2026-07-28T09:12:04.031Z",
      "last_asked": "2026-08-06T16:44:51.882Z",
      "why_missing": "no transfer timing content in the knowledge base",
      "suggested_answer": "Typically 1–3 business days",
      "gap_ids": ["gap-…", "gap-…"],
      "conv_ids": ["conv-…"],
      "status": "open"
    }
  ],
  "count": 1
}
```

Pass every `gap_id` from a group to the `PATCH` to close that question.

:::tip Pair it with `docs ask`
Write the content, then check it landed the way a customer would experience it:

```bash
lira docs add --text="International transfers take 1–3 business days." --title="Transfer times"
lira docs ask "How long does an international transfer take?"
```

If you segment your knowledge base, add `--segments=` to ask as one product's
customer — see [Documents](/knowledge-base/documents).
:::
