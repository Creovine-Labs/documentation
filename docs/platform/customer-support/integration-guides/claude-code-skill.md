---
sidebar_position: 9
title: Claude Code skill
description: Install Lira from inside your AI editor (Claude Code) with a single slash command.
---

# Claude Code skill

If you use [Claude Code](https://claude.com/claude-code) in your editor, you can install Lira into any project with a single slash command instead of running CLI scripts.

```text
/lira-install
```

The skill detects your framework, asks for your org id, and scaffolds the integration the same way `npx @liraintelligence/support init` does — but from inside your editor, with full context of your codebase.

---

## Installing the skill

One time, run this in any terminal:

```bash
npx @liraintelligence/support install-skill
```

That copies the skill to `~/.claude/skills/lira-install/SKILL.md`. Claude Code picks it up automatically on next session.

---

## Using it

Open your project in Claude Code (or any tool that loads Claude Code skills — Codex, Continue, etc.). Type:

```text
/lira-install
```

Claude Code will:

1. **Detect your framework** by reading `package.json` (or `Gemfile`, `manage.py`, etc.)
2. **Ask for your org id** if it isn't already in `.env*`
3. **Run `npx @liraintelligence/support init`** with the right framework flag
4. **Install the npm package** for bundled frameworks (Next.js, Vite, Remix)
5. **Walk you through filling `LIRA_WIDGET_SECRET`** from the Lira dashboard
6. **Point you to the framework-specific docs guide** for anything beyond the basic scaffold

---

## What the skill knows

The skill bundles all the framework knowledge that lives across our [integration guides](/platform/customer-support/integration-guides):

- Per-framework file layouts (e.g. Next.js gets `app/support/page.tsx`, Vite gets `src/Support.tsx`)
- Where the widget secret must live (server-side env var, never `NEXT_PUBLIC_*`)
- How to wire identified-visitor HMAC signing in Node, Ruby, Python, Go
- Common pitfalls per framework

You can ask follow-up questions in chat ("how do I use this with NextAuth?") and the skill knows where to look.

---

## Updating the skill

When we ship a new version, just re-run:

```bash
npx @liraintelligence/support@latest install-skill
```

It overwrites the local `SKILL.md` with the latest version.

---

## Uninstalling

Delete the skill directory:

```bash
rm -rf ~/.claude/skills/lira-install
```

---

## Privacy

The skill runs entirely on your machine. It does NOT send your code, secrets, or any file contents to Lira's servers. The only network calls it makes are:

- `npm install @liraintelligence/support` (npm registry)
- The one-time CDN load of `widget.js` when your dev server runs (`widget.liraintelligence.com`)

The Lira AI conversation runtime (when a customer chats with the widget) connects to `api.creovine.com` — that's chat traffic, not skill traffic.
