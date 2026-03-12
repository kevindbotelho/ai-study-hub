const N8N_API_URL = "https://n8nkevin.vps-kinghost.net/api/v1";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8";

const workflow = {
    name: "AI Study Hub - Gemini Agent",
    settings: {},
    nodes: [
        {
            parameters: {
                httpMethod: "POST",
                path: "ai-study-hub-chat",
                responseMode: "responseNode",
                options: {}
            },
            name: "Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [0, 0],
            webhookId: "ai-study-hub-chat"
        },
        {
            parameters: {
                promptType: "define",
                text: "={{ $json.body.text }}",
                options: {
                    systemMessage: "Você é o assistente virtual do AI Study Hub. Responda o usuário de forma clara, educada e direta em português brasileiro."
                }
            },
            name: "AI Agent",
            type: "@n8n/n8n-nodes-langchain.agent",
            typeVersion: 1,
            position: [250, 0]
        },
        {
            parameters: {
                modelName: "models/gemini-1.5-flash",
                options: {}
            },
            name: "Google Gemini Chat Model",
            type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
            typeVersion: 1,
            position: [250, 200]
        },
        {
            parameters: {
                sessionId: "={{ $('Webhook').item.json.body.session_id }}"
            },
            name: "Window Buffer Memory",
            type: "@n8n/n8n-nodes-langchain.memoryBufferWindow",
            typeVersion: 1,
            position: [400, 200]
        },
        {
            parameters: {
                operation: "insert",
                table: "chat_messages",
                columns: "session_id, role, text",
                session_id: "={{ $('Webhook').item.json.body.session_id }}",
                role: "ai",
                text: "={{ $json.output }}"
            },
            name: "Supabase Insert",
            type: "n8n-nodes-base.supabase",
            typeVersion: 1,
            position: [550, 0],
            credentials: {
                supabaseApi: {
                    id: "DeO6PTzQovwCawxj",
                    name: "Supabase account"
                }
            }
        },
        {
            parameters: {
                respondWith: "json",
                responseBody: "={\n  \"response\": \"{{ $json.output }}\"\n}",
                options: {}
            },
            name: "Respond to Webhook",
            type: "n8n-nodes-base.respondToWebhook",
            typeVersion: 1,
            position: [750, 0]
        }
    ],
    connections: {
        "Webhook": {
            "main": [
                [
                    {
                        "node": "AI Agent",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Google Gemini Chat Model": {
            "ai_languageModel": [
                [
                    {
                        "node": "AI Agent",
                        "type": "ai_languageModel",
                        "index": 0
                    }
                ]
            ]
        },
        "Window Buffer Memory": {
            "ai_memory": [
                [
                    {
                        "node": "AI Agent",
                        "type": "ai_memory",
                        "index": 0
                    }
                ]
            ]
        },
        "AI Agent": {
            "main": [
                [
                    {
                        "node": "Supabase Insert",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        },
        "Supabase Insert": {
            "main": [
                [
                    {
                        "node": "Respond to Webhook",
                        "type": "main",
                        "index": 0
                    }
                ]
            ]
        }
    }
};

async function createWorkflow() {
    try {
        const res = await fetch(`${N8N_API_URL}/workflows`, {
            method: "POST",
            headers: {
                "X-N8N-API-KEY": N8N_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workflow)
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Failed to create workflow:", res.status, text);
            return;
        }
        const data = await res.json();
        console.log("Workflow Created Successfully! ID:", data.id);

        // Delete the previous one to avoid confusion
        await fetch(`${N8N_API_URL}/workflows/pGMnTwDhfX1CWLoR`, {
            method: "DELETE",
            headers: {
                "X-N8N-API-KEY": N8N_API_KEY
            }
        });
        console.log("Old workflow deleted.");
    } catch (e) {
        console.error("Error payload:", e.message);
    }
}

createWorkflow();
