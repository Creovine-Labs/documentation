---
slug: /knowledge-base/google-drive
sidebar_position: 5
title: Google Drive Source
---

# Google Drive Source

Use Google Drive as a knowledge source so Lira can import approved support documents without manual download and re-upload.

## Setup

1. Go to **Grow → Knowledge Base → Connected Sources**
2. Click **Google Drive**
3. A Google sign-in window will open — select your account
4. If you see a verification warning, follow the steps below
5. Grant Drive access permissions

## Google OAuth Verification Notice

When connecting Google Drive, you may see a screen that says:

> **"Google hasn't verified this app"**
> The app is requesting access to sensitive info in your Google Account. Until the developer (NalaLabs) verifies this app with Google, you shouldn't use it.

**This is expected.** Lira is currently going through Google's OAuth verification process. Your data is safe — this warning appears for all unverified apps during the review period.

### How to proceed

1. On the warning screen, click **"Advanced"** (bottom-left of the dialog)
2. A second link will appear — click **"Go to Lira AI (unsafe)"**
3. You'll be taken to the standard Google permissions screen
4. Review the requested permissions and click **"Allow"**

:::tip Why does this happen?
Google requires apps that access user data to complete a formal security review before showing a clean consent screen. We've submitted for review and will update this notice once approved.
:::

:::info Questions?
If you have concerns about data access, email us at **support@liraintelligence.com** — we're happy to explain exactly what permissions are requested and why.
:::

## What Lira can import

| Feature | Description |
|:---|:---|
| List files | Browse Drive contents |
| Search files | Find documents by name or content |
| Read files | Access file content, metadata |
| Read Sheets | Access spreadsheet data |
| Read Docs | Access document text content |

## Use cases

- **Knowledge base source** — Drive documents can feed into your organization's knowledge base
- **Faster updates** — re-import updated source files when your policies or help docs change
