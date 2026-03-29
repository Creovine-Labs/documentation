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
3. Sign in with your Google account (uses the **integration** client ID, not the login one)
4. Grant calendar access permissions

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
