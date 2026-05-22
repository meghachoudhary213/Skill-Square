/**
 * Skill Square Contact Form JS
 * Sends messages directly to the MERN backend database with active UI state handling.
 */

// Dynamically switch API_URL based on active environment (Local vs Production Cloud Server)
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://skill-square-backend-megha.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const subject = document.getElementById("contactSubject").value.trim();
            const message = document.getElementById("contactMessage").value.trim();

            if (!name || !email || !subject || !message) {
                showNotification("Please fill in all fields.", "error");
                return;
            }

            try {
                // Set loading button state
                const submitBtn = contactForm.querySelector("button[type='submit']");
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...`;

                const response = await fetch(`${API_URL}/api/contact`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const data = await response.json();
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                if (data.success) {
                    showNotification(data.message || "Thank you! Your message has been received successfully.", "success");
                    contactForm.reset();
                } else {
                    showNotification(data.message || "Failed to submit message. Please try again.", "error");
                }
            } catch (error) {
                console.error("Contact Form Submission Error:", error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Send Message";
                showNotification("Could not connect to the backend server. Please verify the backend is running!", "error");
            }
        });
    }
});

/**
 * Premium Glassmorphic Toast Notification System
 * Appends custom stylized toasts to the DOM and executes smooth show/hide transitions.
 */
function showNotification(message, type = "success") {
    // Remove existing notifications if any
    const existing = document.querySelector(".custom-notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    // Inject styles dynamically if not already present
    if (!document.getElementById("notificationStyles")) {
        const style = document.createElement("style");
        style.id = "notificationStyles";
        style.textContent = `
            .custom-notification {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 999999;
                padding: 16px 24px;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                font-size: 15px;
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 215, 0, 0.05);
                transform: translateY(100px) scale(0.9);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .custom-notification.active {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            .custom-notification.success {
                background: rgba(46, 204, 113, 0.12);
                border: 1.5px solid #2ecc71;
                color: #2ecc71;
            }
            .custom-notification.error {
                background: rgba(231, 76, 60, 0.12);
                border: 1.5px solid #e74c3c;
                color: #e74c3c;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-content i {
                font-size: 18px;
            }
        `;
        document.head.appendChild(style);
    }

    // Trigger sliding animation
    setTimeout(() => notification.classList.add("active"), 10);

    // Auto-remove notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove("active");
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}
