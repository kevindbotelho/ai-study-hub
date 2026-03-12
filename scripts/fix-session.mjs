const N8N_URL = 'https://n8nkevin.vps-kinghost.net/api/v1';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8';
const WORKFLOW_ID = 'QJ9GymM60U1K8lhi';

async function fix() {
    try {
        const res = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, {
            headers: { 'X-N8N-API-KEY': KEY }
        });
        const w = await res.json();
        const supa = w.nodes.find(n => n.name === 'Supabase Insert');

        supa.parameters.fieldsUi.fieldValues.forEach(f => {
            if (f.fieldId === 'session_id') {
                f.fieldValue = "={{ $('Webhook').item.json.body.session_id }}";
            }
        });

        const cleanWorkflow = {
            name: w.name,
            nodes: w.nodes,
            connections: w.connections,
            settings: w.settings
        };

        const putRes = await fetch(`${N8N_URL}/workflows/${WORKFLOW_ID}`, {
            method: 'PUT',
            headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanWorkflow)
        });

        if (!putRes.ok) console.log(await putRes.text());
        else {
            console.log('Successfully updated Supabase Insert node SessionID binding!');
        }
    } catch (e) { console.error(e); }
}
fix();
