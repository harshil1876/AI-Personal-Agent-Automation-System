# Phase 2: Private Slack Entry Design

## Objective

Design a separate, private Slack entry point for `Personal Agent V2`. The first live V2 workflow will prove only that an approved Slack user can reach V2 and receive a verified reply. It will not access Gmail, Calendar, Tasks, Notes, Expenses, Search, existing memory, or any other personal data.

## Safety boundary

- The existing `Personal Agent` workflow and its Slack configuration remain unchanged.
- V2 uses a new Slack app or a separately approved Slack configuration that cannot replace the legacy app's request URL.
- V2 has its own n8n workflow named `Personal Agent V2`.
- Only one approved Slack user ID is accepted.
- The initial scope is direct messages only. Private-channel support is a later explicit decision.
- Requests from any other user, workspace, channel, or event type are ignored without calling an AI model or another tool.
- The workflow does not log message bodies, credentials, or Slack authorization data in project files.

## Recommended implementation

```text
Slack direct message
  -> V2 Slack Trigger
  -> workspace and user allowlist check
  -> direct-message and event-type check
  -> deterministic V2 acknowledgement
  -> Slack reply
```

The acknowledgement is intentionally deterministic for the initial connectivity test. It avoids model-provider configuration and proves the access boundary before V2 gains AI reasoning or personal integrations.

## Proposed workflow behavior

| Condition | Behavior |
|---|---|
| Approved user sends a direct message | Reply that Personal Agent V2 is connected and operating in safe connectivity-test mode. |
| Unapproved user | Stop without a response or tool call. |
| Approved user in a channel | Stop without a response until channel access is explicitly approved. |
| Unsupported Slack event | Stop without a response. |
| Slack reply fails | Mark execution failed and do not claim a successful reply. |

## Required external changes for implementation

Implementation requires a separate approval after this design review because it would change external services:

- Create or configure a dedicated private Slack app and its event subscription.
- Register V2's n8n webhook URL with that Slack app.
- Add the approved Slack workspace ID and user ID as local configuration values.
- Create and activate one new V2 n8n workflow.
- Configure only the minimum Slack OAuth permissions required to receive and reply to direct messages.

No Slack signing secret, OAuth token, client secret, or webhook credential belongs in chat, this repository, workflow exports, or `.env.example`.

## Implementation test plan

1. Confirm the legacy Personal Agent still receives its existing test message unchanged.
2. Send a direct message as the approved user to the V2 Slack app.
3. Verify V2 returns exactly one connectivity-test acknowledgement.
4. Send a message from an unapproved Slack user, if a safe test account is available, and verify no response or downstream call occurs.
5. Send a channel message and verify V2 ignores it.
6. Disable the V2 workflow or remove the V2 event subscription as a rollback test; verify the legacy agent remains unaffected.

## Rollback plan

- Deactivate or delete only the V2 workflow.
- Remove only the V2 Slack event subscription or dedicated V2 app.
- Remove only V2-specific local configuration values.

These steps do not touch the original Personal Agent workflow, its Slack app, its credentials, or its webhook route.

## Implementation approval decisions

Before implementation, the administrator must explicitly approve all of the following:

1. A separate V2 Slack app rather than modifying the legacy Slack app.
2. Direct messages only for the first V2 test.
3. A deterministic acknowledgement instead of an AI-model reply.
4. The exact Slack workspace ID and Slack user ID to allowlist, supplied through a local interface without posting secrets.
5. Permission to create and activate the V2 n8n workflow and configure the V2 Slack app.
