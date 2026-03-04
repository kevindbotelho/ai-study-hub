const N8N_WEBHOOK_URL = "https://n8nkevin.vps-kinghost.net/webhook/ai-study-hub-chat";

async function testWebhook() {
    console.log("Testing webhook...");
    try {
        const res = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_id: "test-session",
                text: "Oi, isso é um teste!"
            })
        });
        console.log("Status:", res.status);
        const data = await res.text();
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e);
    }
}
testWebhook();
