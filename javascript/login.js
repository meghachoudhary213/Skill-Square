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

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;

    // Password validation: exactly 8 characters, alphanumeric
    const passwordRegex = /^[a-zA-Z0-9]{8}$/;
    if (!passwordRegex.test(password)) {
        showPremiumNotification("Format Requirement", "Password must be exactly 8 characters long and contain only letters and numbers (alphanumeric).", true);
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
            showPremiumNotification("Success", data.message || "Login successful!", false);
            
            // SAVE DATA
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userPhone", data.user.phone || "");
            localStorage.setItem("userLocation", data.user.location || "");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            showPremiumNotification("Login Failed", data.message || "Invalid Email or Password", true);
        }
    } catch (error) {
        console.error("Error during login:", error);
        showPremiumNotification("Server Error", "Server error. Please try again later.", true);
    }

});

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
