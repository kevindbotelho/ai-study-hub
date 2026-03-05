const N8N_URL = 'https://n8nkevin.vps-kinghost.net/api/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8';
const WORKFLOW_ID = 'QJ9GymM60U1K8lhi';

async function updateWorkflow() {
    try {
        const res = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, {
            headers: { 'X-N8N-API-KEY': KEY }
        });
        const workflow = await res.json();

        // Remove ANY brackets from respond node just in case
        for (let node of workflow.nodes) {
            if (node.name === "Respond to Webhook") {
                node.parameters.respondWith = "text";
                node.parameters.responseBody = "={{ $json.output }}";
            }
            if (node.name === "AI Agent") {
                // Ensure there are strictly ZERO {{ }} left anywhere
                node.parameters.options.systemMessage =
                    `Você é o assistente virtual do AI Study Hub. Responda o usuário de forma clara, educada e direta em português brasileiro.

SE o usuário pedir para criar ou gerar um resumo, resumir, card ou flashcard, você DEVE responder EXCLUSIVAMENTE com um JSON estruturado seguindo as chaves type (com valor summary), title, description e category (para a matéria). O retorno NÃO deve conter crases ou a formatação markdown json.

Se não for pedido um resumo ou card focado nisso, apenas converse e responda normalmente em texto.`;
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
        else console.log('Updated workflow response node.');
    } catch (e) { console.error(e); }
}
updateWorkflow();
