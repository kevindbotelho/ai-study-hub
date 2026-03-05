const N8N_API_URL = "https://n8nkevin.vps-kinghost.net/api/v1";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8";
const WORKFLOW_ID = "QJ9GymM60U1K8lhi";

async function updateWorkflow() {
    try {
        const res = await fetch(`${N8N_API_URL}/workflows/${WORKFLOW_ID}`, {
            headers: { "X-N8N-API-KEY": N8N_API_KEY }
        });
        const workflow = await res.json();

        for (let node of workflow.nodes) {
            if (node.name === "Supabase Insert") {
                node.parameters = {
                    operation: "create",
                    table: "chat_messages",
                    dataToSend: "defineBelow",
                    fieldsUi: {
                        fieldValues: [
                            {
                                fieldId: "session_id",
                                fieldValue: "={{ $('Webhook').item.json.body.session_id }}"
                            },
                            {
                                fieldId: "role",
                                fieldValue: "ai"
                            },
                            {
                                fieldId: "text",
                                fieldValue: "={{ $json.output }}"
                            }
                        ]
                    }
                };
            }
        }

        const cleanWorkflow = {
            name: workflow.name,
            nodes: workflow.nodes,
            connections: workflow.connections,
            settings: workflow.settings
        };

        const putRes = await fetch(`${N8N_API_URL}/workflows/${WORKFLOW_ID}`, {
            method: "PUT",
            headers: {
                "X-N8N-API-KEY": N8N_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cleanWorkflow)
        });

        if (!putRes.ok) {
            console.error("Error patching:", await putRes.text());
        } else {
            console.log("Updated Supabase node to use 'create' with mapped UI fields");
        }
    } catch (e) {
        console.error(e);
    }
}
updateWorkflow();
