const API_URL = "https://skill-square-backend-megha.onrender.com";

// Custom Premium Toast Notification System
function showPremiumNotification(title, message, isError = true) {
    let toast = document.getElementById("premiumToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "premiumToast";
        toast.className = "toast-premium";
        document.body.appendChild(toast);
    }
    
    // Clear any active auto-dismiss timers
    if (toast.dataset.timer) {
        clearTimeout(parseInt(toast.dataset.timer));
    }
    
    const iconClass = isError ? "fa-solid fa-circle-xmark error" : "fa-solid fa-circle-check";
    const titleClass = isError ? "error" : "";
    toast.innerHTML = `
        <i class="${iconClass} toast-premium-icon"></i>
        <div class="toast-premium-body">
            <div class="toast-premium-title ${titleClass}">${title}</div>
            <div class="toast-premium-text">${message}</div>
        </div>
        <button class="toast-premium-close" onclick="document.getElementById('premiumToast').classList.remove('active')">&times;</button>
    `;
    
    // Slide in
    toast.classList.remove("active");
    setTimeout(() => {
        toast.classList.add("active");
    }, 50);
    
    // Auto slide out
    const autoClose = setTimeout(() => {
        toast.classList.remove("active");
    }, 4500);
    
    toast.dataset.timer = autoClose;
}

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const location = document.getElementById("location").value.trim();

    const password = document.getElementById("password").value;

    // Check for empty fields
    if (!name) {
        showPremiumNotification("Name Required", "Please enter your full name.", true);
        return;
    }

    if (!email) {
        showPremiumNotification("Email Required", "Please enter your email address.", true);
        return;
    }

    if (!phone) {
        showPremiumNotification("Phone Required", "Please enter your phone number.", true);
        return;
    }

    if (!location) {
        showPremiumNotification("Location Required", "Please enter your location.", true);
        return;
    }

    if (!password) {
        showPremiumNotification("Password Required", "Please enter a password.", true);
        return;
    }

    // Password validation: exactly 8 characters, alphanumeric
    const passwordRegex = /^[a-zA-Z0-9]{8}$/;
    if (!passwordRegex.test(password)) {
        showPremiumNotification("Format Requirement", "Password must be exactly 8 characters long and contain only letters and numbers (alphanumeric).", true);
        return;
    }

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
            showPremiumNotification("Success", data.message || "Registration successful!", false);

            // SAVE DATA
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userPhone", data.user.phone || phone);
            localStorage.setItem("userLocation", data.user.location || location);

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            showPremiumNotification("Registration Failed", data.message || "Registration failed", true);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        showPremiumNotification("Server Error", "Server error. Please try again later.", true);
    }

});

const toggleRegisterPassword = document.getElementById("toggleRegisterPassword");
const registerPasswordInput = document.getElementById("password");
if (toggleRegisterPassword && registerPasswordInput) {
    toggleRegisterPassword.addEventListener("click", function () {
        const isPassword = registerPasswordInput.getAttribute("type") === "password";
        registerPasswordInput.setAttribute("type", isPassword ? "text" : "password");
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
}
