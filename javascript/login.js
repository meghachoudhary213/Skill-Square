const API_URL = (window.location.hostname === "localhost" || 
                 window.location.hostname === "127.0.0.1" || 
                 window.location.hostname.startsWith("192.168.") || 
                 window.location.hostname.startsWith("10.") || 
                 window.location.hostname.startsWith("172.") || 
                 window.location.hostname.endsWith(".local"))
    ? `http://${window.location.hostname}:5000`
    : "https://skill-square-backend-megha.onrender.com";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);

            // SAVE DATA
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userPhone", data.user.phone || "");
            localStorage.setItem("userLocation", data.user.location || "");

            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "Invalid Email or Password");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Server error. Please try again later.");
    }

});