/**
 * Skill Square Admin Panel JS
 * Handles Admin authentication, student directory fetch, and real-time MongoDB CRUD operations.
 */

const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://skill-square-backend-megha.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    // Detect current page
    const pathname = window.location.pathname;
    
    if (pathname.includes("admin-login.html")) {
        initAdminLogin();
    } else if (pathname.includes("admin-dashboard.html")) {
        initAdminDashboard();
    }
});

/**
 * Initialize Admin Login Page
 */
function initAdminLogin() {
    const adminLoginForm = document.getElementById("adminLoginForm");
    if (!adminLoginForm) return;

    adminLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value;

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            // Show loading state on button
            const submitBtn = adminLoginForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...`;

            const response = await fetch(`${API_URL}/api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            if (data.success) {
                alert(data.message || "Admin login successful!");
                localStorage.setItem("adminToken", data.token);
                localStorage.setItem("adminEmail", data.admin.email);
                window.location.href = "admin-dashboard.html";
            } else {
                alert(data.message || "Invalid Admin credentials.");
            }
        } catch (error) {
            console.error("Admin Login Error:", error);
            alert("Failed to connect to the backend server. Make sure the server is running!");
        }
    });
}

/**
 * Initialize Admin Dashboard
 */
function initAdminDashboard() {
    const token = localStorage.getItem("adminToken");
    
    // Auth Guard: Redirect if no admin token
    if (!token) {
        alert("Unauthorized access! Redirecting to login...");
        window.location.href = "admin-login.html";
        return;
    }

    // Set up logout handler
    const logoutBtn = document.getElementById("logoutAdmin");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to log out from the Admin Console?")) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminEmail");
                alert("Logged out successfully.");
                window.location.href = "admin-login.html";
            }
        });
    }

    // Load registered students
    fetchStudents(token);
}

/**
 * Fetch students from the backend and populate the UI
 */
async function fetchStudents(token) {
    const tableBody = document.getElementById("studentTableBody");
    const totalStudentsEl = document.getElementById("totalStudents");
    
    if (!tableBody) return;

    try {
        const response = await fetch(`${API_URL}/api/admin/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            // Token expired or invalid
            alert("Session expired or invalid. Please log in again.");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminEmail");
            window.location.href = "admin-login.html";
            return;
        }

        if (data.success) {
            const users = data.users || [];
            
            // Update stats
            if (totalStudentsEl) {
                totalStudentsEl.textContent = users.length;
            }

            // Populate table
            if (users.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted py-4">
                            No students registered yet.
                        </td>
                    </tr>
                `;
                return;
            }

            tableBody.innerHTML = "";
            users.forEach((user) => {
                const dateRegistered = user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) 
                    : "N/A";

                const phone = user.phone || `<span class="text-muted italic">Not Provided</span>`;
                const location = user.location || `<span class="text-muted italic">Not Provided</span>`;

                const row = document.createElement("tr");
                row.id = `user-row-${user._id}`;
                row.innerHTML = `
                    <td><strong>${escapeHTML(user.name)}</strong></td>
                    <td>${escapeHTML(user.email)}</td>
                    <td>${phone}</td>
                    <td>${escapeHTML(location)}</td>
                    <td>${dateRegistered}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-delete-student" onclick="deleteStudent('${user._id}', '${escapeHTML(user.name)}')">
                            <i class="fa-solid fa-trash-can"></i> Delete
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger py-4">
                        Failed to load directory: ${data.message || "Unknown error"}
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error("Error loading students:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger py-4">
                    Connection failed. Please verify that the backend server is running on port 5000.
                </td>
            </tr>
        `;
    }
}

/**
 * Handle student deletion from DB
 */
window.deleteStudent = async function(userId, userName) {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    if (!confirm(`Are you absolutely sure you want to delete student "${userName}"? This will permanently remove them from the database.`)) {
        return;
    }

    try {
        const deleteBtn = document.querySelector(`#user-row-${userId} .btn-delete-student`);
        if (deleteBtn) {
            deleteBtn.disabled = true;
            deleteBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
        }

        const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message || `Deleted student "${userName}" successfully.`);
            // Smoothly remove row or just refetch
            const row = document.getElementById(`user-row-${userId}`);
            if (row) {
                row.style.transition = "all 0.5s ease";
                row.style.opacity = "0";
                row.style.transform = "translateX(-20px)";
                setTimeout(() => {
                    row.remove();
                    // Decrement student count
                    const totalStudentsEl = document.getElementById("totalStudents");
                    if (totalStudentsEl) {
                        const current = parseInt(totalStudentsEl.textContent) || 0;
                        totalStudentsEl.textContent = Math.max(0, current - 1);
                    }
                    // If no rows left, show "No students registered yet."
                    const tableBody = document.getElementById("studentTableBody");
                    if (tableBody && tableBody.children.length === 0) {
                        tableBody.innerHTML = `
                            <tr>
                                <td colspan="6" class="text-center text-muted py-4">
                                    No students registered yet.
                                </td>
                            </tr>
                        `;
                    }
                }, 500);
            } else {
                fetchStudents(token);
            }
        } else {
            alert(data.message || "Failed to delete student.");
            // Reset button
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete`;
            }
        }
    } catch (error) {
        console.error("Delete Student Error:", error);
        alert("Failed to complete action. Server error or network issue.");
        // Reset button
        const deleteBtn = document.querySelector(`#user-row-${userId} .btn-delete-student`);
        if (deleteBtn) {
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete`;
        }
    }
};

/**
 * Simple Helper to escape HTML characters
 */
function escapeHTML(str) {
    if (!str) return "";
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
