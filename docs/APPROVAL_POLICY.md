# Approval and Safety Policy

## Administrator control

The project administrator is the final approver for every phase and for all external service changes.

## Changes that require explicit approval

- Creating, importing, activating, changing, disabling, or deleting n8n workflows.
- Starting, stopping, replacing, or changing Docker containers, images, volumes, ports, or networks.
- Changing Slack apps, webhook URLs, channels, permissions, or user access rules.
- Changing Google Cloud, OAuth scopes, connected accounts, or Google data.
- Changing Cloudflare tunnels, DNS, domains, or access rules.
- Adding integrations, model providers, databases, storage services, or paid services.
- Enabling scheduled automations or any data-changing tool.

## Secret handling

- Credentials are never placed in chat, workflow exports, source control, documentation, or `.env.example`.
- Real environment files remain local and untracked when they are approved in a later phase.
- Secrets are referenced by name only in project documentation.

## Action policy

- Read-only actions may proceed only through approved workflows.
- Sending, creating, updating, deleting, scheduling, or spending requires a user confirmation step before execution.
- Failures and unknown outcomes are reported honestly; no action is reported as successful without a verified tool result.

## Required milestone report

Every proposed phase states its objective, reason, affected files and services, access required, risks and rollback, and success test. Every completed phase reports what changed, what was tested, outcomes, affected files and services, completion status, and the next approval decision.
