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
        alert("Access Denied! Please log in as a student to access this page.");
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
                if (confirm("Are you sure you want to log out?")) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userPhone");
                    localStorage.removeItem("userLocation");
                    alert("Logged out successfully.");
                    window.location.href = "index.html";
                }
            });
        }
    });
});

function escapeHTML(str) {
    if (!str) return "";
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
