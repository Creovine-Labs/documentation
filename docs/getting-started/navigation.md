---
sidebar_position: 5
title: Navigating the App
description: A guide to finding your way around the Lira platform — sidebar sections, key pages, and common tasks.
---

# Navigating the App

This guide walks you through the Lira app layout so you can find what you need quickly — whether you're on web or mobile.

---

## App Layout

The Lira app has a **left sidebar** that stays visible on all pages. It is divided into three sections:

| Section | What's inside |
|---------|--------------|
| **Top** | Home (Dashboard) |
| **Conversations** | Meetings, Interviews |
| **Workspace** | Knowledge Base, Tasks, Email, Integrations, Usage |
| **Members** | Team members list |
| **Bottom** | Settings |

On mobile, the sidebar collapses into a bottom navigation bar. Tap the menu icon in the top-left to expand the full sidebar.

---

## Home — Dashboard {#dashboard}

**Path:** Sidebar → **Home**

The dashboard gives you an at-a-glance view of recent activity across your organization — latest meetings, pending tasks, and quick-access shortcuts.

---

## Conversations {#conversations}

### Meetings {#meetings}

**Path:** Sidebar → Conversations → **Meetings**

This is where all recorded meeting sessions live. Each meeting card shows the title, date, participants, and processing status.

- **Start a meeting:** Click the **New Meeting** button or invite Lira to your Google Meet from the meeting controls.
- **View a meeting:** Click any meeting card to see the full transcript, summary, and extracted action items.
- **Meeting detail:** Inside a meeting you can read the transcript, view the AI summary, see tasks that were created, and replay the audio.

### Interviews {#interviews}

**Path:** Sidebar → Conversations → **Interviews**

Manage AI-conducted interviews. Interviews are organized by **Role** (job position).

- **Create a role:** Go to Sidebar → Conversations → Interviews → click **New Role**. Define the job title, description, and evaluation rubric.
- **Run an interview:** Share the interview link with a candidate. Lira conducts the session autonomously.
- **View results:** After an interview completes, open the role and click the candidate's entry to see scores, transcript, and AI evaluation.

---

## Workspace {#workspace}

### Knowledge Base {#knowledge-base}

**Path:** Sidebar → Workspace → **Knowledge Base**

The Knowledge Base is where Lira learns about your organisation. Everything you add here — documents, connected sources, and crawled web pages — becomes context Lira can draw on during meetings, interviews, and AI queries.

The Knowledge Base has four tabs:

#### Documents {#documents}

Upload files directly from your computer — PDFs, Word docs, spreadsheets, plain text, CSV, and Markdown. Uploaded files are processed and indexed automatically. Once indexed, Lira can retrieve and reference any content inside them.

- **Upload:** Drag and drop files onto the upload zone, or click Browse to pick files
- **Supported formats:** PDF, DOCX, DOC, TXT, MD, CSV, XLSX (max 50 MB per file)
- **Delete:** Click the trash icon on any document row to remove it permanently
- **Reprocess:** If a document shows a Failed status, click the retry icon to reprocess it

See the full guide: [Documents](/knowledge-base/documents)

#### Connected Sources {#connected-sources}

Connect your Google Drive or GitHub account and import documents directly — no manual download required. Lira lists the available files from your connected account so you can import them with one click.

- **Google Drive:** Connect via OAuth and import Docs, Sheets, and PDFs from your Drive
- **GitHub:** Authorize the Lira GitHub app and import Markdown, text, and code files from your repos
- **Import All:** Import every available file at once using the Import All button
- **Re-import:** Delete the old version in Documents and re-import when source files change

See the full guide: [Connected Sources](/knowledge-base/connected-sources)

#### Web Sources {#web-sources}

Enter any public URL and Lira will crawl it — visiting pages, extracting text, and indexing the content. Best used for your company website, product docs site, or public help centre.

- **Start a crawl:** Enter the URL, set a max page limit (up to 50), and click Crawl
- **Progress:** A status banner shows live crawl progress
- **Delete pages:** Remove individual indexed pages or clear everything with Clear All

See the full guide: [Web Sources](/knowledge-base/web-sources)

#### Query {#query}

Ask questions and get AI-generated answers grounded in everything you've indexed. Lira runs a semantic search across all your knowledge sources and generates a sourced, factual response.

- **Multi-turn chat:** Ask follow-up questions naturally — Lira remembers the conversation
- **Source citations:** Each answer shows which documents or pages the information came from
- **No hallucinations:** If the answer isn't in your Knowledge Base, Lira will say so

See the full guide: [Query](/knowledge-base/query)

---

For a complete guide to the Knowledge Base, see [Knowledge Base Overview](/knowledge-base).

### Tasks {#tasks}

**Path:** Sidebar → Workspace → **Tasks**

All action items extracted by Lira from meetings and interviews appear here. Tasks can be assigned to team members, updated, and marked complete.

- **View a task:** Click any task row to open the detail page.
- **Update status:** Inside the task detail, change the status via the dropdown.
- **Integrations:** If you have Linear or GitHub connected, tasks can be pushed directly to those tools.

### Email {#email}

**Path:** Sidebar → Workspace → **Email**

Configure how Lira sends and receives emails on behalf of your organization. The Email page has two tabs at the top:

- **Settings** — configure sender identity, custom domain, notifications, and AI auto-reply. sub-tabs: General, Sender Identity, Sending Domain, Notifications, Auto-Reply.
- **Inbox** — view inbound email threads that Lira has handled.

For full details, see the [Email Settings guide](/platform/email).

### Integrations {#integrations}

**Path:** Sidebar → Workspace → **Integrations**

Connect third-party tools like Slack, Google Calendar, Linear, GitHub, HubSpot, Salesforce, and Greenhouse.

- **Connect a tool:** Click the **Connect** button on any integration card. You'll be redirected to authorize the connection.
- **Disconnect:** Click the connected integration card and select **Disconnect**.
- **Docs:** Each integration card has a **Docs** link that opens the relevant documentation.

For per-integration setup guides, see [Integrations](/integrations/overview).

### Usage {#usage}

**Path:** Sidebar → Workspace → **Usage**

View your organization's usage stats — meeting minutes, interview sessions, API calls, and plan limits.

---

## Members {#members}

**Path:** Sidebar → **Members**

Manage who is part of your organization.

### Invite a member

1. Go to **Members** in the sidebar.
2. Click **Invite Member**.
3. Enter the person's email address and select a role (Admin or Member).
4. They'll receive an email invitation with a link to join.

### View a member profile

Click any member row to open their profile — showing their activity, meetings attended, interviews conducted, and tasks assigned.

### Remove a member

Open a member's profile and click **Remove from Organization** (Admin only).

---

## Settings {#settings}

**Path:** Sidebar → **Settings** (bottom of sidebar)

Settings is split into tabs in a left sub-navigation panel. The app opens on the **Account** tab by default.

### Account {#settings-account}

Personal account management divided into four sections:

#### Profile

- **Display Name** — edit the name shown to teammates and in the meeting room. Type a new name and click **Save**.
- **Profile Picture** — click your avatar to open your device's file picker. Select any image (PNG, JPG, WebP — max 2 MB). A preview appears immediately; click **Save** to upload it.

#### Security

- **Change Email** — enter a new email address and confirm with your current password. After saving, a verification link is sent to the new address.
- **Change Password** — enter your current password, then a new password (minimum 8 characters), and confirm it.

#### Organizations

Lists every organization you belong to alongside your role. Members and Admins can **Leave** any org directly from this panel. Owners must transfer ownership in the Members page before leaving.

#### Danger Zone

- **Delete Account** — permanently removes your account, all your data, and all your org memberships. You will be asked to confirm with your password. If you are the sole owner of an org that has other members and no other admins, you must transfer ownership first.

---

### Lira Configuration {#settings-ai}

**Path:** Settings → **Lira Configuration**

Customise the AI participant's name, voice, and personality for your workspace.

- **AI Name** — change what Lira is called during meetings. Pick from suggestions or type a custom name.
- **Voice** — choose between four voices (Tiffany, Ruth, Matthew, Stephen).
- **Personality** — pick the communication style: Supportive, Challenger, Facilitator, or Analyst.

### Organization {#settings-organization}

**Path:** Settings → **Organization**

Edit your organization's profile — name, logo, website, and industry. Changes apply to all members.

### Calendar Sync {#settings-calendar}

**Path:** Settings → **Calendar Sync**

Connect Google Calendar so Lira can automatically join scheduled meetings. See the Calendar Sync guide in Integrations for setup details.

### Subscription & Billing {#settings-billing}

Plan management and billing is coming soon.

:::note
Organization-wide membership and invite settings are in **Members** (sidebar). Per-integration setup is in **Workspace → Integrations**.
:::

---

## Switching Organizations {#org-switcher}

If you belong to multiple organizations, click your **organization name / avatar at the top of the sidebar**. A dropdown appears listing all your organizations — click any to switch.

---

## Common Tasks — Quick Reference

| Task | Where to go |
|------|------------|
| Start a meeting | Meetings → New Meeting |
| View meeting summary | Meetings → click the meeting |
| Create an interview role | Interviews → New Role |
| Invite a team member | Members → Invite Member |
| Remove a team member | Members → click member → Remove (Admin/Owner only, with confirmation) |
| Connect Slack / Linear / GitHub | Workspace → Integrations |
| Set up custom email domain | Workspace → Email → Settings → Sending Domain |
| Configure email notifications | Workspace → Email → Settings → Notifications |
| Upload company knowledge | Workspace → Knowledge Base → Upload |
| View/assign tasks | Workspace → Tasks |
| Check usage & limits | Workspace → Usage |
| Change your display name | Settings → Account → Profile |
| Change your profile picture | Settings → Account → Profile → click avatar |
| Change your email | Settings → Account → Security → Change Email |
| Change your password | Settings → Account → Security → Change Password |
| Leave an organization | Settings → Account → Organizations → Leave |
| Delete your account | Settings → Account → Danger Zone → Delete Account |
| Customise Lira's name / voice | Settings → Lira Configuration |
| Switch organization | Click org name at top of sidebar |
