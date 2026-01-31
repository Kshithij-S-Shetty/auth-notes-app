// DASHBOARD WITH STAR SUPPORT + SORTING

let token = localStorage.getItem("token");

if (!token) {
    alert("Session expired. Please login again");
    localStorage.clear();
    window.location.href = "login.html";
}

// ⭐ Get starred notes from localStorage
function getStarredNotes() {
    return JSON.parse(localStorage.getItem("starredNotes")) || [];
}

function saveStarredNotes(stars) {
    localStorage.setItem("starredNotes", JSON.stringify(stars));
}

// Load notes
async function loadNotes() {
    token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/notes", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
            alert("Session expired. Please login again");
            localStorage.clear();
            window.location.href = "login.html";
            return;
        }

        if (!res.ok) {
            alert("Failed to load notes");
            return;
        }

        let notes = await res.json();
        const starred = getStarredNotes();

        // ⭐ Sort: starred notes first
        notes.sort((a, b) => {
            const aStar = starred.includes(a._id);
            const bStar = starred.includes(b._id);
            return bStar - aStar;
        });

        const container = document.getElementById("notesContainer");
        container.innerHTML = "";

        if (!Array.isArray(notes) || notes.length === 0) {
            container.innerText = "No notes yet";
            return;
        }

        notes.forEach(note => {
            const isStarred = starred.includes(note._id);

            const div = document.createElement("div");
            div.className = "note-card";

            div.innerHTML = `
                <div class="note-title-pill">${note.title}</div>


                <div class="note-actions">
                    <button class="starBtn">${isStarred ? "⭐" : "☆"}</button>
                    <button class="deleteBtn">Delete</button>
                </div>
            `;

            // Open note (view page)
            div.querySelector(".note-title-pill").addEventListener("click", () => {
                localStorage.setItem("viewNote", JSON.stringify(note));
                window.location.href = "view-note.html";
            });

            // ⭐ Toggle star
            div.querySelector(".starBtn").addEventListener("click", () => {
                let stars = getStarredNotes();

                if (stars.includes(note._id)) {
                    stars = stars.filter(id => id !== note._id);
                } else {
                    stars.push(note._id);
                }

                saveStarredNotes(stars);
                loadNotes(); // refresh ordering
            });

            // Delete
            div.querySelector(".deleteBtn").addEventListener("click", () => {
                deleteNote(note._id);
            });

            container.appendChild(div);
        });

    } catch (err) {
        alert("Failed to load notes");
    }
}

// Delete note
async function deleteNote(noteId) {
    token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            // Remove from starred list too
            let stars = getStarredNotes().filter(id => id !== noteId);
            saveStarredNotes(stars);
            loadNotes();
        } else {
            alert("Delete failed");
        }
    } catch {
        alert("Delete failed");
    }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    }

    loadNotes();
});

