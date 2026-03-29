---
slug: /integrations/greenhouse
sidebar_position: 10
title: Greenhouse
---

# Greenhouse Integration

Connect Lira to Greenhouse ATS for candidate management, job tracking, and interview scorecard integration.

## Setup

1. Go to **Organization Settings → Integrations → Greenhouse**
2. Enter your **Greenhouse Harvest API key**
3. Verify the connection

## Capabilities

| Feature | Description |
|:---|:---|
| Candidates | List, view, and manage candidates |
| Jobs | Browse open positions and job details |
| Applications | Track candidate applications through stages |
| Scorecards | Submit interview scorecards from Lira's evaluations |

## Interview Integration

When Lira conducts an autonomous interview:

1. Candidate data can be pulled from Greenhouse
2. After the interview, Lira's evaluation can be submitted as a Greenhouse scorecard
3. Application stage can be updated based on the interview outcome

## Authentication

Greenhouse uses **API key authentication** (not OAuth). The API key is stored encrypted in DynamoDB, scoped to the organization.
