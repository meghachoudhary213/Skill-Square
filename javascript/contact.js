/**
 * Skill Square Contact Form JS
 * Sends messages directly to the MERN backend database with active UI state handling.
 */

const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://skill-square-backend.onrender.com";

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
                alert("Please fill in all fields.");
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
                    alert(data.message || "Thank you! Your message has been received successfully.");
                    contactForm.reset();
                } else {
                    alert(data.message || "Failed to submit message. Please try again.");
                }
            } catch (error) {
                console.error("Contact Form Submission Error:", error);
                alert("Could not connect to the backend server. Please verify the backend is running!");
            }
        });
    }
});
