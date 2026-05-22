const API_URL = "https://skill-square-backend-megha.onrender.com";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const phone = document.getElementById("phone").value;

    const location = document.getElementById("location").value;

    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, phone, location, password })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);

            // SAVE DATA
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userPhone", data.user.phone || phone);
            localStorage.setItem("userLocation", data.user.location || location);

            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("Server error. Please try again later.");
    }

});