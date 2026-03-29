---
slug: /platform/sales-coaching
sidebar_position: 3
title: Sales Coaching
---

# Sales Coaching

Real-time AI coaching for sales teams — transcription, objection handling, battle cards, and CRM auto-fill during live calls.

## Features

### Real-Time Transcription

During a sales call, Lira transcribes the conversation with speaker attribution, giving your rep a live view of what's been said.

### Objection Handling

When a prospect raises an objection, Lira identifies it in real-time and surfaces:

- **Suggested responses** tailored to the objection type
- **Battle cards** with competitive positioning
- **Supporting data** from your knowledge base

### CRM Auto-Fill

After the call, Lira automatically:

- Updates the deal/opportunity record in **HubSpot** or **Salesforce**
- Logs call notes with key discussion points
- Updates deal stage if appropriate
- Creates follow-up tasks

### Call Analytics

Post-call analysis includes:

- Talk-to-listen ratio
- Question frequency
- Objection patterns
- Sentiment analysis
- Per-rep performance trends over time

## Desktop App

A dedicated desktop application architecture is specified for always-on sales coaching:

- Runs in the system tray
- Captures audio from any meeting app (Zoom, Teams, Meet)
- Overlay UI with real-time coaching prompts
- Works independently of browser-based Lira

See the [Sales Coaching Desktop App spec](/architecture/overview) for implementation details.

## CRM Integration

Sales Coaching integrates deeply with:

| CRM | Capabilities |
|:---|:---|
| **HubSpot** | Contacts, companies, deals, pipelines, notes, call logging |
| **Salesforce** | Accounts, contacts, opportunities, leads, pipelines, notes |

See [HubSpot Integration](/integrations/hubspot) and [Salesforce Integration](/integrations/salesforce) for setup instructions.
