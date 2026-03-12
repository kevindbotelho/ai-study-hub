const N8N_URL = 'https://n8nkevin.vps-kinghost.net/api/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8';
const WORKFLOW_ID = 'QJ9GymM60U1K8lhi';

async function updateWorkflow() {
    try {
        const res = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, { headers: { 'X-N8N-API-KEY': KEY } });
        const w = await res.json();
        const aiNode = w.nodes.find(n => n.name === 'AI Agent');

        aiNode.parameters.options.systemMessage = `Você é o Academy AI, um assistente educacional do Study Hub.
Ao responder as dúvidas do usuário sobre um tema (ex: "O que é MCP?"), você DEVE gerar uma explicação aprofundada e longa, estruturada em tópicos Markdown (ex: 'O que é', 'Para que serve', 'Como funciona', 'Aplicações'). Escreva uma resposta completíssima.

REGRA OBRIGATÓRIA:
No final absoluto da sua resposta (depois de toda a sua explicação longa), você deve anexar um bloco de código JSON contendo um resumo curto e um título.

Use EXATAMENTE este formato para a sua resposta:

<Sua explicação longa e aprofundada em Markdown puro, com quantos parágrafos e tópicos quiser>

---
\`\`\`json
{{
  "summary": "Um parágrafo curto de 2 a 3 linhas resumindo a explicação principal de forma objetiva, ideal para um card de flashcard.",
  "title": "Um título curto e claro para o tema abordado"
}}
\`\`\``;

        const putRes = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, {
            method: 'PUT',
            headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: w.name, nodes: w.nodes, connections: w.connections, settings: w.settings })
        });
        if (!putRes.ok) console.log(await putRes.text());
        else console.log('Successfully updated AI Agent System Prompt!');
    } catch (e) { console.error(e); }
}
updateWorkflow();
