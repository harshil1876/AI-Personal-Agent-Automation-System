# AI Personal Agent & Automation System

A self-hosted personal AI executive assistant built with n8n and Google Gemini. It uses Slack as a conversational interface and modular tools for web search, email, calendar, expenses, notes, and task management.

The system executes multi-step actions from natural-language commands, persists conversational memory in PostgreSQL, and exposes the local n8n instance securely through a Cloudflare Tunnel and custom domain.

## Features

- Natural-language Slack interface with loop prevention
- Gemini-powered tool selection and multi-step automation
- PostgreSQL-backed persistent chat memory
- Google Calendar, Gmail, Google Docs, Google Sheets, and Google Tasks integrations
- Web search through SerpAPI
- Local Docker-based n8n and PostgreSQL services
- Secure external webhook access through Cloudflare Tunnel
- Asia/Kolkata timezone-aware date and time handling

## Tech Stack

`n8n` · `Google Gemini` · `PostgreSQL` · `Slack` · `Google APIs` · `SerpAPI` · `Cloudflare` · `Docker`

## Repository Layout

- `infrastructure/` — V2 Docker Compose configuration
- `docs/` — architecture, approval policy, and implementation decisions
- `workflow-exports/` — reviewed, secret-free n8n workflow templates
- `tools/` — utilities for preparing safe workflow templates

## Quick Start

1. Install Docker Desktop and start it.
2. Copy `.env.example` to `.env` and set a local PostgreSQL password.
3. Start PostgreSQL with:
   `docker compose --env-file .env -f infrastructure/docker-compose.v2.yml up -d postgres-v2`
4. Start or import the V2 n8n workflow on port `5679`.
5. Add credentials directly in n8n for Slack, Gemini, Google, and SerpAPI.

Never commit `.env`, OAuth tokens, API keys, Slack secrets, or Cloudflare tunnel tokens. The legacy n8n workflow on port `5678` is intentionally outside this project.

## Status

The V2 foundation, Docker/PostgreSQL persistence, Cloudflare webhook route, Slack entry point, Gemini agent, Google tools, search, and persistent memory have been validated incrementally. Production deployment still requires an always-on host; a local laptop must remain powered on for the local tunnel and containers to run.
