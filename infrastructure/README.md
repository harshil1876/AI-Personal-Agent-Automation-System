# V2 Infrastructure

This directory is reserved for approved reproducible V2 infrastructure.

`docker-compose.v2.yml` defines only the isolated V2 n8n service. It uses host port `5679` and volume `personal_agent_v2_n8n_data`; the existing manually managed n8n container remains on port `5678` and is not referenced.

PostgreSQL is planned for a later phase. The V2 service must be reviewed before startup. Cloudflare routing and Slack configuration are separate approved steps.
