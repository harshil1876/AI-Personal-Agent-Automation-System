# Hybrid Main Workflow Import Guide

The file `Personal Agent V2 - hybrid main template.json` is a new main-workflow template. It does not replace the currently working workflow.

## Import order

1. Import the five files in `workflow-exports/sub-workflows/`.
2. Configure credentials in each sub-workflow.
3. Save each sub-workflow and note its workflow name/ID.
4. Import `Personal Agent V2 - hybrid main template.json`.
5. Configure Slack, Gemini, and PostgreSQL credentials.
6. Open each domain tool node and select its corresponding imported sub-workflow.
7. Confirm each tool description and input mapping.
8. Save the new main workflow with a new name, such as `Personal Agent V2 - Hybrid`.
9. Keep the old workflow available until the complete verification phase passes.

## Main architecture

```text
Slack Trigger
      ↓
Main AI Agent ← Gemini Chat Model
      ├── Calendar Sub-workflow
      ├── Email Sub-workflow
      ├── Expense Sub-workflow
      ├── Notes Sub-workflow
      └── Tasks Sub-workflow
      ↓
Send a message → Slack
```

The generated template is intentionally inactive and credential-free. Do not activate it until every sub-workflow ID, credential, and input mapping has been reviewed.
