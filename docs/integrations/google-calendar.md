---
slug: /integrations/google-calendar
sidebar_position: 4
title: Google Calendar
---

# Google Calendar Integration

Sync meetings with Google Calendar — create events, list calendars, and set organization defaults.

## Setup

1. Go to **Organization Settings → Integrations → Google Calendar**
2. Click **Connect Google Calendar**
3. A Google sign-in window will open — select your account
4. If you see a verification warning, follow the steps below
5. Grant calendar access permissions

## Google OAuth Verification Notice

When connecting Google Calendar, you may see a screen that says:

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
If you have concerns about data access, email us at **support@liraintelligence.com**.
:::

## Capabilities

| Feature | Description |
|:---|:---|
| Create events | Schedule meetings with Google Meet links |
| Update events | Modify existing calendar events |
| List calendars | Browse all available calendars |
| Set default calendar | Choose which calendar Lira uses per organization |

## Event Creation

When Lira identifies a meeting action item like "Let's schedule a follow-up next Tuesday," she can create a calendar event with:

- Title and description
- Date and time
- Attendees (from org member mapping)
- Google Meet link (auto-generated)

## Dual OAuth Note

Google Calendar uses a **separate OAuth client ID** from the one used for platform login. This ensures logging into Lira never requests access to your calendar. Permissions are granted explicitly when you connect the integration.
