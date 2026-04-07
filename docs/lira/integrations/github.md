---
sidebar_position: 6
title: GitHub
description: Repository, issue, and PR integration with GitHub.
---

# GitHub Integration

Connect Lira to **GitHub** for repository browsing, issue management, and pull request tracking.

## Setup

1. Navigate to **Settings → Integrations → GitHub**
2. Click **Connect** — redirects to GitHub OAuth consent
3. Authorize access to your repositories
4. Configure member mappings

## Capabilities

| Feature | Description |
|:---|:---|
| **Repository listing** | List accessible repos |
| **Branch listing** | List branches in a repo |
| **File browsing** | Browse and read repository files |
| **Issues** | Create, list, and read issues |
| **Pull requests** | List and read PRs |
| **Code search** | Search across repositories |
| **Member mapping** | Map GitHub users to Lira org members |

## Meeting Integration

During meetings, Lira can reference GitHub data when relevant:

- Surface open issues related to discussion topics
- Create issues from meeting action items
- Reference recent PRs when discussing code changes

## OAuth Configuration

| Variable | Description |
|:---|:---|
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
