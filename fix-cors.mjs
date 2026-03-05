const N8N_URL = 'https://n8nkevin.vps-kinghost.net/api/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8';
const WORKFLOW_ID = 'QJ9GymM60U1K8lhi';

async function updateWorkflow() {
    try {
        const res = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, {
            headers: { 'X-N8N-API-KEY': KEY }
        });
        const workflow = await res.json();

        for (let node of workflow.nodes) {
            if (node.name === "Webhook") {
                node.parameters.options = node.parameters.options || {};
                node.parameters.options.cors = true;
            }
        }

        const cleanWorkflow = {
            name: workflow.name,
            nodes: workflow.nodes,
            connections: workflow.connections,
            settings: workflow.settings
        };

        const putRes = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, {
            method: 'PUT',
            headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanWorkflow)
        });

        if (!putRes.ok) console.log(await putRes.text());
        else console.log('Updated workflow Webhook node to enable CORS');
    } catch (e) { console.error(e); }
}
updateWorkflow();
