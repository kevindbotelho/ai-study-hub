const N8N_URL = 'https://n8nkevin.vps-kinghost.net/api/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8';
const WORKFLOW_ID = 'QJ9GymM60U1K8lhi';

async function check() {
    try {
        const res = await fetch(`${N8N_URL}/executions?includeData=true&workflowId=${WORKFLOW_ID}&limit=20`, {
            headers: { 'X-N8N-API-KEY': KEY }
        });
        const data = await res.json();
        data.data.forEach(e => {
            console.log(e.id, 'Finished:', e.finished, 'Status:', e.status, 'Created:', new Date(e.createdAt).toLocaleString(), 'Error:', e?.data?.resultData?.error?.message?.slice(0, 30));
        });
    } catch (e) { console.error(e); }
}
check();
