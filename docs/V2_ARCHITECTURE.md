# Personal Agent V2 Architecture

## Purpose

Personal Agent V2 is a private, single-user Personal AI Operating System. It begins with Slack as an interface and grows through a shared backend, policy layer, specialist workflows, persistent data, and later private interfaces.

## Boundary with the legacy system

The existing `Personal Agent` n8n workflow is a presentation baseline. It is not imported, overwritten, disabled, deleted, or changed by V2 work.

V2 resources use distinct names, files, workflows, and future service definitions. Existing Slack, Google, Cloudflare, Docker, and credential configurations are not reused or modified without explicit approval.

## Target layers

```text
Private interfaces
Slack | private web | desktop | mobile | voice
                 |
Identity, policy, approvals, backend API
                 |
Executive intent router and planner
                 |
Specialist workflows and skills
                 |
Integrations, memory, audit data, knowledge systems
```

## Initial V2 flow

```text
Approved Slack request
  -> V2 entry workflow
  -> identity and policy check
  -> read-only response or action proposal
  -> explicit confirmation for data-changing actions
  -> approved specialist workflow
  -> result verification and audit record
  -> concise Slack response
```

## Design decisions

- Slack is the first interface, but interfaces must not duplicate business logic.
- The Executive Agent routes requests; it does not permanently own every tool.
- Specialist workflows remain focused and independently testable.
- Read-only work is distinct from sending, creating, updating, deleting, or spending.
- A tool result is required before reporting an action as successful.
- PostgreSQL-backed conversation history, structured memory, and audit records are planned for later phases.
- Knowledge retrieval and long-term memory remain separate systems.

## Deferred work

No database, tunnel, named domain, web application, RAG system, scheduler, mobile client, voice interface, public access, or multi-user support is included in Phase 1.
