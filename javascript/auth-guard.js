// Override native window.alert with premium toast notification
if (typeof window !== "undefined") {
    window.alert = function(message) {
        const lower = message.toLowerCase();
        const isError = lower.includes("failed") || 
                        lower.includes("error") || 
                        lower.includes("denied") || 
                        lower.includes("invalid") || 
                        lower.includes("unauthorized") || 
                        lower.includes("expire") || 
                        lower.includes("not match") || 
                        lower.includes("could not connect") || 
                        lower.includes("not authorized") ||
                        lower.includes("fill in") ||
                        lower.includes("please login") ||
                        lower.includes("enter both") ||
                        lower.includes("please enter") ||
                        lower.includes("first");
                        
        const title = isError ? "Alert / Notification" : "Notification";

        let toast = document.getElementById("premiumToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "premiumToast";
            toast.className = "toast-premium";
            document.body.appendChild(toast);
        }
        
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
        
        toast.classList.remove("active");
        setTimeout(() => {
            toast.classList.add("active");
        }, 50);
        
        const autoClose = setTimeout(() => {
            toast.classList.remove("active");
        }, 4500);
        
        toast.dataset.timer = autoClose;
    };
}

// Broker premium toast from localStorage for cross-redirect alerts
(function() {
    const brokerMsg = localStorage.getItem("brokerToastMessage");
    if (brokerMsg) {
        setTimeout(() => {
            alert(brokerMsg);
        }, 300);
        localStorage.removeItem("brokerToastMessage");
        localStorage.removeItem("brokerToastType");
    }
})();

/**
 * Student Auth Guard and Dashboard Utility
 * Prevents unauthorized access, updates greetings dynamically, and handles secure logouts.
 */

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    // 1. Auth Guard Check
    const publicPages = ["index.html", "login.html", "register.html", "admin-login.html", "admin-dashboard.html"];
    const currentPage = window.location.pathname.split("/").pop();

    // Protect all dashboard/student pages if no token
    if (!token && !publicPages.includes(currentPage) && currentPage !== "") {
        localStorage.setItem("brokerToastMessage", "Access Denied! Please log in as a student to access this page.");
        localStorage.setItem("brokerToastType", "error");
        window.location.href = "login.html";
        return;
    }

    // 2. Dynamic Welcomes and Data Rendering
    if (token) {
        // Welcome Greeting on Student Dashboard
        const welcomeHeading = document.querySelector(".top-bar h1");
        if (welcomeHeading && userName) {
            welcomeHeading.innerHTML = `Welcome Back, ${escapeHTML(userName)} 👋`;
        }
    }

    // 3. Secure Logout Handling
    const logoutLinks = document.querySelectorAll('a[href="index.html"]');
    logoutLinks.forEach(link => {
        if (link.textContent.includes("Logout") || link.querySelector(".fa-right-from-bracket")) {
            // Replace link destination with JavaScript event handler
            link.addEventListener("click", (e) => {
                e.preventDefault();
                window.confirmPremium("Are you sure you want to log out of your student session? All active states will be closed.", () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userPhone");
                    localStorage.removeItem("userLocation");
                    alert("Logged out successfully.");
                    window.location.href = "index.html";
                });
            });
        }
    });
});

/**
 * Premium Custom Confirmation Dialog Overlay
 */
window.confirmPremium = function(message, onConfirm) {
    let confirmOverlay = document.getElementById("premiumConfirmModal");
    if (!confirmOverlay) {
        confirmOverlay = document.createElement("div");
        confirmOverlay.id = "premiumConfirmModal";
        confirmOverlay.className = "confirm-premium-overlay";
        document.body.appendChild(confirmOverlay);
    }

    confirmOverlay.innerHTML = `
        <div class="confirm-premium-content">
            <i class="fa-solid fa-circle-question confirm-premium-icon"></i>
            <h3>Confirm Action</h3>
            <p>${message}</p>
            <div class="confirm-premium-actions">
                <button class="confirm-premium-btn cancel" id="premiumConfirmCancel">Cancel</button>
                <button class="confirm-premium-btn confirm" id="premiumConfirmOk">Yes, Logout</button>
            </div>
        </div>
    `;

    setTimeout(() => {
        confirmOverlay.classList.add("active");
    }, 50);

    const cancelBtn = confirmOverlay.querySelector("#premiumConfirmCancel");
    const confirmBtn = confirmOverlay.querySelector("#premiumConfirmOk");

    const closeConfirm = () => {
        confirmOverlay.classList.remove("active");
    };

    cancelBtn.addEventListener("click", closeConfirm);
    
    confirmBtn.addEventListener("click", () => {
        closeConfirm();
        onConfirm();
    });
};

function escapeHTML(str) {
    if (!str) return "";
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Load AI Chatbot automatically on all pages
(function() {
    if (document.getElementById("aiChatLauncher")) return;
    const script = document.createElement("script");
    script.src = "javascript/chatbot.js?v=" + new Date().getTime();
    document.body.appendChild(script);
})();
