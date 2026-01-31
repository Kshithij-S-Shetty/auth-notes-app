document.addEventListener("DOMContentLoaded", () => {
    const noteData = localStorage.getItem("viewNote");

    if (!noteData) {
        alert("Note not found");
        window.location.href = "dashboard.html";
        return;
    }

    let note = JSON.parse(noteData);

    const titleEl = document.getElementById("noteTitle");
    const contentEl = document.getElementById("noteContent");
    const backBtn = document.getElementById("backBtn");
    const exportBtn = document.getElementById("exportBtn");
    const starBtn = document.getElementById("starBtn");

    const searchToggleBtn = document.getElementById("searchToggleBtn");
    const searchBox = document.getElementById("searchBox");
    const searchInput = document.getElementById("searchInput");

    titleEl.innerText = note.title;

    /* ---------- SAFE CONTENT RENDER ---------- */
    function renderContent(keyword = "") {
        let text = note.content;

        // Escape HTML
        text = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Preserve formatting
        text = text.replace(/\n/g, "<br>");

        // Highlight search
        if (keyword) {
            const regex = new RegExp(`(${keyword})`, "gi");
            text = text.replace(regex, `<mark>$1</mark>`);
        }

        contentEl.innerHTML = text;
    }

    // Initial render
    renderContent();

    /* ---------------- STAR (UNCHANGED) ---------------- */

    updateStarUI();

    starBtn.addEventListener("click", () => {
        note.isImportant = !note.isImportant;
        localStorage.setItem("viewNote", JSON.stringify(note));
        updateStarUI();
    });

    function updateStarUI() {
        starBtn.innerText = note.isImportant ? "⭐️" : "☆";
    }

    /* ---------------- BACK (UNCHANGED) ---------------- */

    backBtn.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });

    /* ---------------- EXPORT (UNCHANGED) ---------------- */

    exportBtn.addEventListener("click", () => {
        const text = note.title + "\n\n" + note.content;

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const safeTitle = note.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();

        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeTitle || "note"}.txt`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    /* ---------------- SEARCH (FIXED, SAFE) ---------------- */

    searchToggleBtn.addEventListener("click", () => {
        searchBox.classList.toggle("hidden");
        searchInput.focus();
    });

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.trim();
        renderContent(keyword);
    });
});
