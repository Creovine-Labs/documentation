---
slug: /knowledge-base/connected-sources
sidebar_position: 3
title: Connected Sources
description: Pull documents straight from Google Drive or GitHub without manual uploads — connect, browse, and import in one place.
---

# Connected Sources

The **Connected Sources** tab lets you pull in documents from cloud services you already use — without downloading and re-uploading files manually. Connect your Google Drive or GitHub account and Lira will list the available files so you can import them directly into the Knowledge Base.

**Path:** Sidebar → Workspace → Knowledge Base → **Connected Sources**

---

## Why use Connected Sources?

Most organisational knowledge already lives in Drive or GitHub. Connected Sources lets you treat those as the source of truth — you manage files where you normally would, and import them into Lira with a click. When documents change, you simply re-import the updated version.

---

## Google Drive

### Connecting

1. Click the **Google Drive** tile on the Connected Sources tab
2. You'll be redirected to Google's OAuth consent screen
3. Sign in with the Google account that has access to the files you want
4. Grant the requested permissions and click **Allow**
5. You'll be redirected back to Lira — the Google Drive tile will now show a file count

:::note OAuth verification notice
You may see a screen saying "Google hasn't verified this app." This is expected while Lira completes Google's formal review process. Click **Advanced → Go to Lira AI (unsafe)** to proceed safely. See the [Google Drive integration guide](/integrations/google-drive) for full details.
:::

### What files are available?

After connecting, Lira lists files from your Drive that it can process:

- Google Docs (exported as text)
- Google Sheets (exported as CSV)
- PDFs and Word documents stored in Drive

### Importing files

Click the Google Drive tile to expand the file browser. For each file you can:

- **Import** — click the **Import** button on the file card to add it to your Knowledge Base. It will be fetched, processed, and indexed.
- **Import All** — click the **Import All** button at the top to import every unimported file at once.
- **View** — click the **View** link to open the file in Google Drive in a new tab.

Already-imported files are shown with a green **Imported** badge.

---

## GitHub

### Connecting

1. Click the **GitHub** tile on the Connected Sources tab
2. You'll be redirected to GitHub's OAuth authorization page
3. Click **Authorize Lira** and select which repositories to grant access to
4. You'll be redirected back — the GitHub tile will show a file count

### What files are available?

Lira lists documentation and text files from your connected repositories:

- Markdown files (`.md`, `.mdx`) — README files, wikis, changelogs
- Plain text files (`.txt`)
- Code files that contain meaningful documentation or configuration

### Importing files

The same import flow applies — click the GitHub tile to expand the file browser, then import individual files or all at once.

Each file card shows:
- The **repository** it belongs to (e.g. `org/repo-name`)
- A **View** link to open it on GitHub

---

## Import status

When you import a file, it enters the same processing pipeline as an uploaded document:

1. Lira fetches the file from the source
2. It is chunked and embedded
3. The status becomes **Indexed** once ready

Imported files appear in the **Documents** tab after import, where you can track processing status and delete them if needed.

---

## Re-importing updated files

Lira does not automatically sync changes from Drive or GitHub. If a source file changes:

1. Go to **Documents** and delete the old version
2. Go back to **Connected Sources**, find the file, and click **Import** again

This ensures Lira always works with the latest content.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No files listed after connecting | Make sure the connected account has files Lira can read (see supported formats) |
| Import fails | The file may be empty, too large, or in an unsupported format |
| OAuth redirects to an error page | Try disconnecting and reconnecting — the token may have expired |
| "Imported" badge shows but status is "Failed" in Documents | Open the Documents tab and click Reprocess |
