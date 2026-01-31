document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // stop page refresh

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Registered successfully");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }

    } catch (err) {
        alert("Server not reachable");
    }
});
