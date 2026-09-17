const fs = require('fs');

const sourcePath = 'C:/Users/Harshil/Downloads/Personal Agent.json';
const outputPath = 'workflow-exports/Personal Agent V2 - import template.json';
const workflow = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

workflow.name = 'Personal Agent V2';
workflow.active = false;
workflow.id = undefined;
workflow.meta = undefined;

for (const node of workflow.nodes ?? []) {
  node.credentials = undefined;
}

fs.writeFileSync(outputPath, `${JSON.stringify(workflow, null, 2)}\n`, 'utf8');
console.log(`Created ${outputPath} with ${workflow.nodes.length} nodes and no credential bindings.`);
