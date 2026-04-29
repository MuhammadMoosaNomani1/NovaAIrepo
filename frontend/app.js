async function sendMessage() {
    const input = document.getElementById("input");
    const chatBox = document.getElementById("chatBox");

    const message = input.value.trim();

    // ❌ prevent empty messages
    if (!message) return;

    // 👤 USER MESSAGE (GOOD - KEEP THIS)
    const userDiv = document.createElement("div");
    userDiv.className = "message user";
    userDiv.textContent = message;
    chatBox.appendChild(userDiv);

    // 🤖 LOADING MESSAGE (FIXED)
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message ai loading";
    loadingDiv.textContent = "Typing...";
    chatBox.appendChild(loadingDiv);

    // 🔽 SCROLL AFTER USER + LOADING ADDED
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const res = await fetch("http://localhost:5000/api/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await res.json();

        // ❌ REMOVE LOADING (correct way)
        loadingDiv.remove();

        // 🤖 AI MESSAGE (FIXED)
        const aiDiv = document.createElement("div");
        aiDiv.className = "message ai";
        aiDiv.textContent = data.reply;
        chatBox.appendChild(aiDiv);

        // 🔽 SCROLL AFTER AI IS ADDED (IMPORTANT FIX)
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        loadingDiv.remove();

        const errorDiv = document.createElement("div");
        errorDiv.style.color = "red";
        errorDiv.textContent = "Server error";
        chatBox.appendChild(errorDiv);

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    input.value = "";
    input.focus();
}