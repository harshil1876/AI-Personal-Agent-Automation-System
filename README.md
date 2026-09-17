# AI Personal Agent & Automation System

> A self-hosted AI executive assistant that turns natural-language requests into practical, multi-step automations.

![Status](https://img.shields.io/badge/status-active%20development-orange)
![Self-hosted](https://img.shields.io/badge/deployment-self--hosted-blue)
![License](https://img.shields.io/badge/license-to%20be%20decided-lightgrey)

A self-hosted personal AI executive assistant built with n8n and Google Gemini. It uses Slack as a conversational interface and modular tools for web search, email, calendar, expenses, notes, and task management.

The system executes multi-step actions from natural-language commands, persists conversational memory in PostgreSQL, and exposes the local n8n instance securely through a Cloudflare Tunnel and custom domain.

## Overview

This project combines conversational AI with reliable workflow automation. Users interact through Slack while the agent coordinates Google Calendar, Gmail, Google Sheets, Google Docs, Google Tasks, web search, expense tracking, notes, and scheduling workflows.

## Features

- Natural-language Slack interface with loop prevention
- Gemini-powered tool selection and multi-step automation
- PostgreSQL-backed persistent chat memory
- Google Calendar, Gmail, Google Docs, Google Sheets, and Google Tasks integrations
- Web search through SerpAPI
- Local Docker-based n8n and PostgreSQL services
- Secure external webhook access through Cloudflare Tunnel
- Asia/Kolkata timezone-aware date and time handling

## Architecture

```text
Slack → Cloudflare Tunnel → n8n (V2) → Google Gemini
                                  ├── PostgreSQL memory
                                  ├── Google productivity tools
                                  └── SerpAPI web search
```

## Tech Stack

`n8n` · `Google Gemini` · `PostgreSQL` · `Slack` · `Google APIs` · `SerpAPI` · `Cloudflare` · `Docker`

## Project Structure

```text
.
├── docs/                 # Architecture, policy, and design decisions
├── infrastructure/      # V2 Docker Compose configuration
├── tools/                # Safe workflow-template utilities
├── workflow-exports/     # Reviewed, secret-free n8n templates
├── workflows/            # Workflow documentation and placeholders
├── .env.example          # Environment variable template
└── README.md
```

## Repository Layout

- `infrastructure/` — V2 Docker Compose configuration
- `docs/` — architecture, approval policy, and implementation decisions
- `workflow-exports/` — reviewed, secret-free n8n workflow templates
- `tools/` — utilities for preparing safe workflow templates

## Getting Started

### Prerequisites

- Docker Desktop
- Slack app and workspace
- Google Cloud project with required APIs enabled
- Google Gemini API access
- SerpAPI access for web search
- Cloudflare account and domain for external webhooks

### Local setup

1. Install Docker Desktop and start it.
2. Copy `.env.example` to `.env` and set a local PostgreSQL password.
3. Start PostgreSQL with:
   `docker compose --env-file .env -f infrastructure/docker-compose.v2.yml up -d postgres-v2`
4. Start or import the V2 n8n workflow on port `5679`.
5. Add credentials directly in n8n for Slack, Gemini, Google, and SerpAPI.

6. Configure the Cloudflare Tunnel route to the V2 webhook endpoint when external Slack events are required.

Never commit `.env`, OAuth tokens, API keys, Slack secrets, or Cloudflare tunnel tokens. The legacy n8n workflow on port `5678` is intentionally outside this project.

## Security

Never commit `.env` files, API keys, OAuth tokens, Slack secrets, Cloudflare tunnel tokens, private workflow exports, or personal email/calendar/expense data. Credentials belong in n8n or local environment configuration only.

The legacy n8n workflow on port `5678` is intentionally separate from V2.

## Status

The V2 foundation, Docker/PostgreSQL persistence, Cloudflare webhook route, Slack entry point, Gemini agent, Google tools, search, and persistent memory have been validated incrementally. Production deployment still requires an always-on host; a local laptop must remain powered on for the local tunnel and containers to run.

## Roadmap

- Structured intent extraction and stronger confirmation flows
- Idempotency, auditing, and failure notifications for side effects
- Long-term semantic memory and retrieval
- Automated workflow tests and health checks
- Production deployment for an always-on host

## License

License terms will be added before public redistribution or production release.
