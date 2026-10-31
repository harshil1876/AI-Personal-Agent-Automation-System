const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'workflow-exports', 'Personal Agent V2 - import template.json');
const outputPath = path.join(__dirname, '..', 'workflow-exports', 'Personal Agent V2 - hybrid main template.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const byName = Object.fromEntries(source.nodes.map((node) => [node.name, node]));

const keep = ['Slack Trigger', 'AI Agent', 'Google Gemini Chat Model', 'Send a message'];
const nodes = keep.map((name) => JSON.parse(JSON.stringify(byName[name])));
nodes.push({
  parameters: {
    sessionIdType: 'customKey',
    sessionKey: '={{ "main-v2-" + ($json.user || "default") }}',
    tableName: 'n8n_chat_histories',
    contextWindowLength: 10
  },
  type: '@n8n/n8n-nodes-langchain.memoryPostgresChat',
  typeVersion: 1.2,
  position: [-20, 220],
  id: 'hybrid-postgres-memory',
  name: 'Postgres Chat Memory'
});
const agent = nodes.find((node) => node.name === 'AI Agent');
agent.parameters.options = agent.parameters.options || {};
agent.parameters.options.systemMessage = `${agent.parameters.options.systemMessage || ''}\n\nHYBRID ARCHITECTURE:\nUse the domain sub-workflow tools for calendar, email, expenses, notes, and tasks. Pass userMessage, sessionId, runtime_now, and timezone to the selected domain workflow. Never perform these operations with hidden assumptions. Confirm side-effect actions before execution and report only verified results.`;

const domains = [
  ['Calendar Sub-workflow', 'Manage calendar events: create, list, find, update, and delete. Confirm ambiguous or destructive changes.'],
  ['Email Sub-workflow', 'Search, read, summarize, draft, and send Gmail messages. Confirm before sending.'],
  ['Expense Sub-workflow', 'Add and retrieve expenses in Google Sheets. Use exact row IDs for changes and verify results.'],
  ['Notes Sub-workflow', 'Create, read, and update Google Docs notes without overwriting content unexpectedly.'],
  ['Tasks Sub-workflow', 'Create, list, update, complete, and delete Google Tasks. Confirm deletions.']
];

for (const [name, description] of domains) {
  nodes.push({
    parameters: {
      workflowId: { __rl: true, value: '', mode: 'list', cachedResultName: name },
      description,
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          userMessage: '={{ $json.userMessage || $json.text || $json.query }}',
          sessionId: '={{ $json.sessionId || $json.user || "default" }}',
          runtime_now: '={{ $json.runtime_now }}',
          timezone: 'Asia/Kolkata'
        }
      }
    },
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 1.2,
    position: [320 + nodes.length * 40, 220],
    id: `hybrid-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name
  });
}

const connections = {
  'Slack Trigger': { main: [[{ node: 'AI Agent', type: 'main', index: 0 }]] },
  'AI Agent': { main: [[{ node: 'Send a message', type: 'main', index: 0 }]] },
  'Google Gemini Chat Model': { ai_languageModel: [[{ node: 'AI Agent', type: 'ai_languageModel', index: 0 }]] },
  'Postgres Chat Memory': { ai_memory: [[{ node: 'AI Agent', type: 'ai_memory', index: 0 }]] }
};
for (const [name] of domains) {
  connections[name] = { ai_tool: [[{ node: 'AI Agent', type: 'ai_tool', index: 0 }]] };
}

fs.writeFileSync(outputPath, JSON.stringify({
  name: 'Personal Agent V2 - Hybrid Main',
  nodes,
  pinData: {},
  connections,
  active: false,
  settings: { executionOrder: 'v1', timezone: 'Asia/Kolkata' },
  versionId: 'personal-agent-v2-hybrid-template',
  meta: { templateCredsSetupCompleted: false },
  tags: []
}, null, 2) + '\n');
