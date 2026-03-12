const N8N_API_URL = "https://n8nkevin.vps-kinghost.net/api/v1";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8";
const WORKFLOW_ID = "QJ9GymM60U1K8lhi";

async function updateWorkflow() {
    try {
        // Fetch existing logic to keep credentials intact
        const res = await fetch(`${N8N_API_URL}/workflows/${WORKFLOW_ID}`, {
            method: "GET",
            headers: {
                "X-N8N-API-KEY": N8N_API_KEY
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch workflow:", res.status);
            return;
        }

        const workflow = await res.json();

        // Update the AI Agent node prompt
        for (let node of workflow.nodes) {
            if (node.name === "AI Agent") {
                node.parameters.options = node.parameters.options || {};
                node.parameters.options.systemMessage =
                    `Você é o assistente virtual do AI Study Hub. Responda o usuário de forma clara, educada e direta em português brasileiro.

SE o usuário pedir para criar ou gerar um "resumo", "resumir", "card" ou "flashcard", você DEVE responder EXCLUSIVAMENTE com um JSON estruturado seguindo as chaves "type" (com valor "summary"), "title", "description" e "category" (para a matéria). O retorno NÃO deve conter crases ou a formatação markdown "json".

Se não for pedido um resumo ou card focado nisso, apenas converse e responda normalmente em texto.`;
                break;
            }
        }

        // Strip read-only properties that cause "must not have additional properties" error
        const cleanWorkflow = {
            name: workflow.name,
            nodes: workflow.nodes,
            connections: workflow.connections,
            settings: workflow.settings
        };

        // Send it back
        const putRes = await fetch(`${N8N_API_URL}/workflows/${WORKFLOW_ID}`, {
            method: "PUT",
            headers: {
                "X-N8N-API-KEY": N8N_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cleanWorkflow)
        });

        if (!putRes.ok) {
            const text = await putRes.text();
            console.error("Failed to update workflow:", putRes.status, text);
            return;
        }

        console.log("Workflow successfully updated to output JSON cards!");

    } catch (e) {
        console.error("Error updating workflow:", e.message);
    }
}

updateWorkflow();
