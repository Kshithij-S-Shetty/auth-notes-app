// Get token from localStorage
let token = localStorage.getItem("token");

// Remove any whitespace from token
if (token) {
    token = token.trim();
}

// If no token, redirect immediately
if (!token) {
    window.location.href = "login.html";
}

document.getElementById("noteForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Re-read token to ensure it's current
    token = localStorage.getItem("token");
    if (token) {
        token = token.trim();
    }

    if (!token) {
        alert("Session expired. Please login again");
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert("Title and content are required");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });

        // Handle 401 Unauthorized
        if (res.status === 401) {
            alert("Session expired. Please login again");
            localStorage.clear();
            window.location.href = "login.html";
            return;
        }

        if (res.ok) {
            alert("Note added");
            titleInput.value = "";
            contentInput.value = "";
            titleInput.focus();
        } else {
            const data = await res.json().catch(() => ({ message: "Failed to add note" }));
            alert(data.message || "Failed to add note");
        }

    } catch (error) {
        console.error("Error adding note:", error);
        alert("Server error");
    }
});
