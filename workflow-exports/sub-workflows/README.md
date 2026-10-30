# Personal Agent V2 Sub-workflows

These files are credential-free n8n import templates for the hybrid architecture.

## Templates

- `Calendar Sub-workflow.json` — calendar create, lookup, list, update, and delete
- `Email Sub-workflow.json` — Gmail search, read, and send
- `Expense Sub-workflow.json` — Google Sheets expense retrieval and insertion
- `Notes Sub-workflow.json` — Google Docs note create, read, and update
- `Tasks Sub-workflow.json` — Google Tasks list, create, update, and delete

## Import procedure

1. Open V2 n8n at `http://localhost:5679`.
2. Import one JSON file from the n8n workflow menu.
3. Open each node with a credential field and select the existing credential; these templates intentionally contain no secrets.
4. Confirm the Gemini model, PostgreSQL memory, and Google tool parameters.
5. Save the workflow with the exact name shown in the template.
6. Keep the sub-workflow inactive until the parent workflow is wired and reviewed.

## Parent contract

The parent workflow should call a sub-workflow with these fields:

```json
{
  "userMessage": "request text",
  "sessionId": "stable-user-session-id",
  "runtime_now": "ISO-8601 timestamp",
  "timezone": "Asia/Kolkata"
}
```

The Execute Sub-workflow node in the parent should select the imported workflow and map the contract fields. The sub-workflow returns the Domain AI Agent result to the parent.

## Important

These are starting templates, not production activation instructions. Review tool descriptions, confirmation behavior, credential selection, and output mapping before enabling any workflow that sends email, changes calendars, or modifies expenses.
