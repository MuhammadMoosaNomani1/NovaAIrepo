
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Ollama API call
function isMathExpression(text) {
    return /^[0-9+\-*/().\s]+$/.test(text);
}

app.post("/api/message", async (req, res) => {
    try {
        const message = req.body.message;

        // 👇 ADD HERE (exact spot)
        const msg = message.toLowerCase().trim();

        if (["hi", "hello", "hey"].includes(msg)) {
            return res.json({ reply: "Hello! How can I help you today?" });
        }

        // 🧮 HANDLE MATH FIRST
        if (isMathExpression(message)) {
            function safeEval(expr) {
    return Function('"use strict"; return (' + expr + ')')();
}
            const result = eval(message);
            return res.json({ reply: String(result) });
        }

        // 🤖 OTHERWISE USE AI
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "mistral",
               prompt: message + " (answer briefly in 2-3 lines)",
                stream: false
            })
        });

        const data = await response.json();

        const reply = data.response?.trim();

const finalReply =
    reply && reply.length > 0
        ? reply
        : "Hello! How can I help you?";

return res.json({ reply: finalReply });

    } catch (err) {
    console.log("AI ERROR:", err.message);
    res.json({ reply: "AI Error (check Ollama running)" });
}
});

app.listen(5000, () => {
    console.log("NotifyAI running on http://localhost:5000");
});
