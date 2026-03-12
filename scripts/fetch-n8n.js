const fs = require('fs');
const N8N_API_URL = "https://n8nkevin.vps-kinghost.net/api/v1";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3YWRmNDJjYS0xZDBmLTRkODAtYTRmNC1mMTRhYmU3OGEzMTYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzIwMGQ5ZDMtNjYwMC00MDliLWE3NmItOTdjNGQyYTMyYzhmIiwiaWF0IjoxNzcyNjYzODk2fQ.ZsNyAYwpruOacOA8ojppCiGdHsSp-pO7fjtQU4L6tx8";

async function fetchTypes() {
    try {
        const res = await fetch(`${N8N_API_URL}/workflows`, {
            method: "GET",
            headers: {
                "X-N8N-API-KEY": N8N_API_KEY
            }
        });
        const data = await res.json();
        fs.writeFileSync('workflows.json', JSON.stringify(data, null, 2));
        console.log("Saved to workflows.json");
    } catch (e) {
        console.error(e);
    }
}
fetchTypes();
