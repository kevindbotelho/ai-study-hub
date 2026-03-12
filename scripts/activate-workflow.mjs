const N8N_API_URL = "https://n8nkevin.vps-kinghost.net/api/v1";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8";
const WORKFLOW_ID = "QJ9GymM60U1K8lhi";

async function activateWorkflow() {
    try {
        const res = await fetch(`${N8N_API_URL}/workflows/${WORKFLOW_ID}/activate`, {
            method: "POST",
            headers: { "X-N8N-API-KEY": N8N_API_KEY }
        });

        if (!res.ok) {
            console.error("Failed to activate workflow:", res.status, await res.text());
        } else {
            console.log("Successfully activated workflow!");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

activateWorkflow();
