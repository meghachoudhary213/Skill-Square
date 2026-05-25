// Dynamically switch API_URL based on active environment (Local vs Production Cloud Server)
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://skill-square-backend-megha.onrender.com";

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

// Global variable to store registration form values during OTP verification
let pendingResetData = null;
let otpTimer = null;

document.addEventListener("DOMContentLoaded", () => {
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
                showPremiumNotification("Missing Information", "All fields are required.", true);
                return;
            }

            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                showPremiumNotification("Password Requirements", "Password must be at least 8 characters long and contain letters, numbers, and symbols.", true);
                return;
            }

            if (newPassword !== confirmPassword) {
                showPremiumNotification("Password Mismatch", "New Passwords do not match. Please verify.", true);
                return;
            }

            // Save pending reset details
            pendingResetData = { email, phone, newPassword };

            // Request password reset OTP
            await requestResetOTP(email, phone);
        });
    }

    // Initialize OTP Modal digit focus shifters
    setupOTPInputShifting();

    // Attach OTP Action Handlers
    const cancelOTPBtn = document.getElementById("cancelOTPBtn");
    const verifyOTPBtn = document.getElementById("verifyOTPBtn");
    const resendOTPBtn = document.getElementById("resendOTPBtn");

    if (cancelOTPBtn) {
        cancelOTPBtn.addEventListener("click", () => {
            closeOTPModal();
            showPremiumNotification("Cancelled", "Password reset process cancelled.", true);
        });
    }

    if (resendOTPBtn) {
        resendOTPBtn.addEventListener("click", async () => {
            if (pendingResetData) {
                await requestResetOTP(pendingResetData.email, pendingResetData.phone);
            }
        });
    }

    if (verifyOTPBtn) {
        verifyOTPBtn.addEventListener("click", async () => {
            const otpCode = getEnteredOTP();
            if (otpCode.length < 6) {
                showPremiumNotification("Verification Error", "Please enter the complete 6-digit OTP code.", true);
                return;
            }

            await completePasswordReset(otpCode);
        });
    }
});

// Function to call /send-forgot-otp and launch the verification Modal
async function requestResetOTP(email, phone) {
    try {
        const submitBtn = document.querySelector("#forgotPasswordForm button[type='submit']");
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "Reset Password";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending OTP...`;
        }

        const response = await fetch(`${API_URL}/api/auth/send-forgot-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, phone })
        });

        const data = await response.json();

        // Restore submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }

        if (data.success) {
            showPremiumNotification("OTP Code Sent", data.message || "Please check your email for reset OTP.", false);

            // Render Email Display
            const emailDisplay = document.getElementById("otpEmailDisplay");
            if (emailDisplay) {
                emailDisplay.textContent = email;
            }

            // Check if OTP was bypassed in terminal console
            const otpConsoleNotice = document.getElementById("otpConsoleNotice");
            if (otpConsoleNotice) {
                if (data.message.includes("Node server console")) {
                    otpConsoleNotice.style.display = "block";
                } else {
                    otpConsoleNotice.style.display = "none";
                }
            }

            // Launch Modal
            openOTPModal();
            startOTPTimer();
        } else {
            showPremiumNotification("Reset Failed", data.message || "Invalid account details provided.", true);
        }
    } catch (error) {
        console.error("Error requesting reset OTP:", error);
        showPremiumNotification("Server Connection Issue", "Could not connect to the backend server. Please verify the server is running.", true);
        
        const submitBtn = document.querySelector("#forgotPasswordForm button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Reset Password";
        }
    }
}

// Function to call /reset-password with all inputs including OTP
async function completePasswordReset(otp) {
    if (!pendingResetData) return;

    try {
        const verifyOTPBtn = document.getElementById("verifyOTPBtn");
        const originalBtnText = verifyOTPBtn.innerHTML;
        verifyOTPBtn.disabled = true;
        verifyOTPBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Resetting...`;

        const response = await fetch(`${API_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: pendingResetData.email,
                phone: pendingResetData.phone,
                newPassword: pendingResetData.newPassword,
                otp: otp
            })
        });

        const data = await response.json();

        verifyOTPBtn.disabled = false;
        verifyOTPBtn.innerHTML = originalBtnText;

        if (data.success) {
            showPremiumNotification("Success", data.message || "Password updated successfully!", false);

            closeOTPModal();
            pendingResetData = null;

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            showPremiumNotification("Verification Failed", data.message || "Invalid OTP code entered.", true);
            clearOTPInputs();
        }
    } catch (error) {
        console.error("Error confirming reset:", error);
        showPremiumNotification("Server Connection Issue", "Could not verify OTP. Check server status.", true);
        const verifyOTPBtn = document.getElementById("verifyOTPBtn");
        if (verifyOTPBtn) {
            verifyOTPBtn.disabled = false;
            verifyOTPBtn.innerHTML = "Verify & Reset";
        }
    }
}

// UI Helpers for OTP Modal
function openOTPModal() {
    const modal = document.getElementById("otpModal");
    if (modal) {
        modal.style.display = "flex";
        clearOTPInputs();
        // Focus first input automatically
        const firstInput = document.getElementById("otp_1");
        if (firstInput) firstInput.focus();
    }
}

function closeOTPModal() {
    const modal = document.getElementById("otpModal");
    if (modal) {
        modal.style.display = "none";
    }
    if (otpTimer) {
        clearInterval(otpTimer);
    }
}

function clearOTPInputs() {
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById(`otp_${i}`);
        if (input) input.value = "";
    }
    const firstInput = document.getElementById("otp_1");
    if (firstInput) firstInput.focus();
}

function getEnteredOTP() {
    let code = "";
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById(`otp_${i}`);
        if (input) code += input.value;
    }
    return code;
}

function setupOTPInputShifting() {
    for (let i = 1; i <= 6; i++) {
        const currentInput = document.getElementById(`otp_${i}`);
        if (!currentInput) continue;

        currentInput.addEventListener("input", (e) => {
            const val = currentInput.value;
            currentInput.value = val.replace(/[^0-9]/g, "");

            if (currentInput.value.length === 1 && i < 6) {
                const nextInput = document.getElementById(`otp_${i + 1}`);
                if (nextInput) nextInput.focus();
            }
        });

        currentInput.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && currentInput.value.length === 0 && i > 1) {
                const prevInput = document.getElementById(`otp_${i - 1}`);
                if (prevInput) {
                    prevInput.focus();
                    prevInput.value = "";
                }
            }
        });

        if (i === 1) {
            currentInput.addEventListener("paste", (e) => {
                const pasteData = (e.clipboardData || window.clipboardData).getData("text").trim();
                if (/^[0-9]{6}$/.test(pasteData)) {
                    e.preventDefault();
                    for (let j = 0; j < 6; j++) {
                        const cell = document.getElementById(`otp_${j + 1}`);
                        if (cell) cell.value = pasteData[j];
                    }
                    const verifyOTPBtn = document.getElementById("verifyOTPBtn");
                    if (verifyOTPBtn) verifyOTPBtn.focus();
                }
            });
        }
    }
}

function startOTPTimer() {
    const timerDisplay = document.getElementById("otpCountdown");
    const resendBtn = document.getElementById("resendOTPBtn");
    
    if (!timerDisplay || !resendBtn) return;

    let timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    resendBtn.style.display = "none";
    timerDisplay.parentElement.style.display = "block";

    if (otpTimer) {
        clearInterval(otpTimer);
    }

    otpTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(otpTimer);
            resendBtn.style.display = "inline-block";
            timerDisplay.parentElement.style.display = "none";
        }
    }, 1000);
}
