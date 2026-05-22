const API_URL = "https://skill-square-backend-megha.onrender.com";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    // Password validation: exactly 8 characters, alphanumeric
    const passwordRegex = /^[a-zA-Z0-9]{8}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be exactly 8 characters long and contain only letters and numbers (alphanumeric).");
        return;
    }

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

// Toggle password and email visibility
const toggleLoginEmail = document.getElementById("toggleLoginEmail");
const loginEmailInput = document.getElementById("loginEmail");
if (toggleLoginEmail && loginEmailInput) {
    toggleLoginEmail.addEventListener("click", function () {
        const isEmail = loginEmailInput.getAttribute("type") === "email";
        loginEmailInput.setAttribute("type", isEmail ? "password" : "email");
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
}

const toggleLoginPassword = document.getElementById("toggleLoginPassword");
const loginPasswordInput = document.getElementById("loginPassword");
if (toggleLoginPassword && loginPasswordInput) {
    toggleLoginPassword.addEventListener("click", function () {
        const isPassword = loginPasswordInput.getAttribute("type") === "password";
        loginPasswordInput.setAttribute("type", isPassword ? "text" : "password");
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
}