const N8N_URL = 'https://n8nkevin.vps-kinghost.net/api/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8';
const WORKFLOW_ID = 'QJ9GymM60U1K8lhi';

async function check() {
    try {
        const res = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, {
            headers: { 'X-N8N-API-KEY': KEY }
        });
        const w = await res.json();
        const r = w.nodes.find(n => n.name === 'Respond to Webhook');
        console.log(JSON.stringify(r.parameters, null, 2));
    } catch (e) { console.error(e); }
}
check();
