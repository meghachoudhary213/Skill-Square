const API_URL = "https://skill-square-backend-megha.onrender.com";

const forgotPasswordForm = document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("forgotEmail").value.trim();
        const phone = document.getElementById("forgotPhone").value.trim();
        const newPassword = document.getElementById("forgotPassword").value;
        const confirmPassword = document.getElementById("forgotConfirmPassword").value;

        // Validations
        if (!email || !phone || !newPassword || !confirmPassword) {
            alert("All fields are required.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match. Please verify.");
            return;
        }

        try {
            // Show loading state
            const submitBtn = forgotPasswordForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Resetting Password...`;

            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, phone, newPassword })
            });

            const data = await response.json();
            
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            if (data.success) {
                alert(data.message || "Password updated successfully!");
                window.location.href = "login.html";
            } else {
                alert(data.message || "Failed to reset password. Please check your registered email & phone number.");
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            alert("Server connection failed. Please check if the server is running.");
        }
    });
}
