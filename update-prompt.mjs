const N8N_URL = 'https://n8nkevin.vps-kinghost.net/api/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8';
const WORKFLOW_ID = 'QJ9GymM60U1K8lhi';

async function updateWorkflow() {
    try {
        const res = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, { headers: { 'X-N8N-API-KEY': KEY } });
        const w = await res.json();
        const aiNode = w.nodes.find(n => n.name === 'AI Agent');

        aiNode.parameters.options.systemMessage = `Você é o Academy AI, um assistente educacional do Study Hub.
Ao responder as dúvidas do usuário sobre um tema (ex: "O que é MCP?"), você DEVE gerar uma explicação aprofundada estruturada e um resumo curto.
Sua resposta final deve ser EXCLUSIVAMENTE um objeto JSON válido, sem marcações markdown de bloco de código no início ou fim (\`\`\`json), com a seguinte estrutura estrita:

{{
  "full_answer": "Sua resposta longa e estruturada em Markdown. Inclua subtópicos como 'O que é', 'Para que serve', 'Como funciona', 'Aplicações' e 'Vantagens' dependendo do que fizer sentido.",
  "summary": "Um parágrafo curto de 2 a 3 linhas resumindo a explicação acima de forma objetiva, ideal para um card de estudos (Flashcard/Resumo).",
  "title": "Um título curto e claro para o tema (ex: 'Model Context Protocol (MCP)')."
}}

Sua saída deve ser APENAS o JSON validamente formatado (chaves e valores), sem strings extras. Use quebras de linha (\\n\\n) apenas dentro das strings JSON se precisar formatar o markdown.`;

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
