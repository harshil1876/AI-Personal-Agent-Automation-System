const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'workflow-exports', 'Personal Agent V2 - import template.json');
const outputDir = path.join(__dirname, '..', 'workflow-exports', 'sub-workflows');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const domains = [
  {
    file: 'Calendar Sub-workflow.json',
    name: 'Personal Agent V2 - Calendar Sub-workflow',
    tools: ['Create_Calender_Event', 'Get_Single_Calender_Event', 'Get_Calender_Events', 'Update_Calender_Event', 'Delete_Calender_Events'],
    instruction: 'Handle calendar requests only. Use the calendar tools for create, lookup, list, update, and delete operations. Respect the supplied timezone and current date. Confirm destructive or ambiguous changes before acting. Return a concise result to the parent workflow.'
  },
  {
    file: 'Email Sub-workflow.json',
    name: 'Personal Agent V2 - Email Sub-workflow',
    tools: ['Get_Single_Email', 'Get_Messages_Email', 'Send_Messages_Email'],
    instruction: 'Handle Gmail requests only. Search and summarize messages accurately. Before sending, verify recipients, subject, and body and require confirmation for external side effects. Never claim an email was sent without a successful tool result.'
  },
  {
    file: 'Expense Sub-workflow.json',
    name: 'Personal Agent V2 - Expense Sub-workflow',
    tools: ['Get_Expense', 'Add_Expenses'],
    instruction: 'Handle expense tracking only. Extract amount, category, date, and remark without guessing. Retrieve the matching row before updates. Use exact row IDs for changes and ask for clarification when multiple rows match. Never claim success without a successful Sheets result.'
  },
  {
    file: 'Notes Sub-workflow.json',
    name: 'Personal Agent V2 - Notes Sub-workflow',
    tools: ['Create_Notes_File', 'Get_Notes_File', 'Update_Note_File'],
    instruction: 'Handle Google Docs notes only. Create, read, and update notes. Do not overwrite existing content unless the user explicitly requests it. Return the document title and operation result clearly.'
  },
  {
    file: 'Tasks Sub-workflow.json',
    name: 'Personal Agent V2 - Tasks Sub-workflow',
    tools: ['Get_Single_Task', 'Create_Tasks', 'Get_Multiple_Task', 'Update_Tasks', 'Delete_Tasks'],
    instruction: 'Handle task-management requests only. Create, list, update, and delete tasks. Ask for clarification when the task or due date is ambiguous. Confirm deletions before acting and never claim success without a successful tool result.'
  }
];

function cloneNode(node, name) {
  return JSON.parse(JSON.stringify({ ...node, name }));
}

function makeDomain(domain) {
  const sourceNodes = Object.fromEntries(source.nodes.map((node) => [node.name, node]));
  const trigger = {
    parameters: {},
    type: 'n8n-nodes-base.executeWorkflowTrigger',
    typeVersion: 1,
    position: [-760, 0],
    id: `${domain.name}-trigger`,
    name: 'Execute Workflow Trigger'
  };
  const agent = cloneNode(sourceNodes['AI Agent'], 'Domain AI Agent');
  agent.id = `${domain.name}-agent`;
  agent.position = [-240, 0];
  agent.parameters.text = '={{ $json.userMessage || $json.text || $json.query || JSON.stringify($json) }}';
  agent.parameters.options = agent.parameters.options || {};
  agent.parameters.options.systemMessage = `${domain.instruction}\n\nInput contract: the parent workflow should provide userMessage, sessionId, runtime_now, and timezone. Preserve these fields when returning output.`;

  const model = cloneNode(sourceNodes['Google Gemini Chat Model'], 'Google Gemini Chat Model');
  model.id = `${domain.name}-model`;
  model.position = [-240, 220];
  const memory = {
    parameters: {
      sessionIdType: 'customKey',
      sessionKey: '={{ $json.sessionId || "domain-default" }}',
      tableName: 'n8n_chat_histories',
      contextWindowLength: 10
    },
    type: '@n8n/n8n-nodes-langchain.memoryPostgresChat',
    typeVersion: 1.2,
    position: [0, 220],
    id: `${domain.name}-memory`,
    name: 'Postgres Chat Memory'
  };
  const nodes = [trigger, agent, model, memory];
  const toolPositions = domain.tools.map((tool, index) => {
    const node = cloneNode(sourceNodes[tool], tool);
    node.id = `${domain.name}-${tool}`;
    node.position = [220 + (index % 2) * 260, 160 + Math.floor(index / 2) * 220];
    return node;
  });
  nodes.push(...toolPositions);
  const connections = {
    'Execute Workflow Trigger': { main: [[{ node: 'Domain AI Agent', type: 'main', index: 0 }]] },
    'Google Gemini Chat Model': { ai_languageModel: [[{ node: 'Domain AI Agent', type: 'ai_languageModel', index: 0 }]] },
    'Postgres Chat Memory': { ai_memory: [[{ node: 'Domain AI Agent', type: 'ai_memory', index: 0 }]] }
  };
  for (const tool of domain.tools) {
    connections[tool] = { ai_tool: [[{ node: 'Domain AI Agent', type: 'ai_tool', index: 0 }]] };
  }
  return {
    name: domain.name,
    nodes,
    pinData: {},
    connections,
    active: false,
    settings: { executionOrder: 'v1', timezone: 'Asia/Kolkata' },
    versionId: `${domain.name}-template`,
    meta: { templateCredsSetupCompleted: false },
    tags: []
  };
}

fs.mkdirSync(outputDir, { recursive: true });
for (const domain of domains) {
  fs.writeFileSync(path.join(outputDir, domain.file), JSON.stringify(makeDomain(domain), null, 2) + '\n');
}
