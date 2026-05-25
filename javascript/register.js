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
let pendingRegisterData = null;
let otpTimer = null;

// Initialize script
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const countryCode = document.getElementById("registerCountry").value;
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

            // Mobile number country-wise validation
            const cleanPhone = phone.replace(/\D/g, "");
            let expectedLength = 10;
            if (countryCode === "+61" || countryCode === "+971") {
                expectedLength = 9;
            }

            if (cleanPhone.length !== expectedLength) {
                showPremiumNotification("Format Requirement", `Mobile number for ${countryCode} must be exactly ${expectedLength} digits.`, true);
                return;
            }

            const combinedPhone = `${countryCode} ${cleanPhone}`;

            if (!location) {
                showPremiumNotification("Location Required", "Please enter your location.", true);
                return;
            }

            if (!password) {
                showPremiumNotification("Password Required", "Please enter a password.", true);
                return;
            }

            // Password validation: minimum 8 characters, alphanumeric and symbolic
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
            if (!passwordRegex.test(password)) {
                showPremiumNotification("Format Requirement", "Password must be at least 8 characters long and contain letters, numbers, and symbols.", true);
                return;
            }

            // Store pending registration data
            pendingRegisterData = { name, email, phone: combinedPhone, location, password };

            // Request OTP Code
            await requestRegistrationOTP(email);
        });
    }

    // Toggle Password Visibility
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

    // Initialize OTP Modal inputs auto-shifting focus
    setupOTPInputShifting();

    // Attach OTP Action Handlers
    const cancelOTPBtn = document.getElementById("cancelOTPBtn");
    const verifyOTPBtn = document.getElementById("verifyOTPBtn");
    const resendOTPBtn = document.getElementById("resendOTPBtn");

    if (cancelOTPBtn) {
        cancelOTPBtn.addEventListener("click", () => {
            closeOTPModal();
            showPremiumNotification("Cancelled", "Registration process cancelled.", true);
        });
    }

    if (resendOTPBtn) {
        resendOTPBtn.addEventListener("click", async () => {
            if (pendingRegisterData && pendingRegisterData.email) {
                await requestRegistrationOTP(pendingRegisterData.email);
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

            await completeRegistration(otpCode);
        });
    }

    // Dynamic phone constraint handling based on selected country code
    const registerCountry = document.getElementById("registerCountry");
    const phoneInput = document.getElementById("phone");

    if (registerCountry && phoneInput) {
        function updatePhoneConstraints() {
            const countryCode = registerCountry.value;
            let expectedLength = 10;
            if (countryCode === "+61" || countryCode === "+971") {
                expectedLength = 9;
            }
            phoneInput.placeholder = `Mobile Number (${expectedLength} digits)`;
            phoneInput.maxLength = expectedLength;
            
            // Clean up existing characters if they exceed the new max length
            const cleanVal = phoneInput.value.replace(/\D/g, "");
            if (cleanVal.length > expectedLength) {
                phoneInput.value = cleanVal.slice(0, expectedLength);
            } else {
                phoneInput.value = cleanVal;
            }
        }

        registerCountry.addEventListener("change", updatePhoneConstraints);
        
        // Dynamic input sanitization (only allow digits)
        phoneInput.addEventListener("input", function() {
            this.value = this.value.replace(/\D/g, "");
        });

        // Run once on load to initialize constraints
        updatePhoneConstraints();
    }
});

// Function to call /send-otp and launch the OTP Verification Modal
async function requestRegistrationOTP(email) {
    try {
        // Set loading state on main submit button
        const submitBtn = document.querySelector("#registerForm button[type='submit']");
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "Register";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending OTP...`;
        }

        const response = await fetch(`${API_URL}/api/auth/send-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        // Restore submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }

        if (data.success) {
            showPremiumNotification("OTP Code Sent", data.message || "Please check your email for verification.", false);
            
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
            showPremiumNotification("Error", data.message || "Failed to generate verification OTP.", true);
        }
    } catch (error) {
        console.error("Error sending registration OTP:", error);
        showPremiumNotification("Server Connection Issue", "Could not connect to the backend server. Please verify the server is running on port 5000.", true);
        
        // Ensure button resets on failure
        const submitBtn = document.querySelector("#registerForm button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Register";
        }
    }
}

// Function to call /register with all variables including OTP
async function completeRegistration(otp) {
    if (!pendingRegisterData) return;

    try {
        const verifyOTPBtn = document.getElementById("verifyOTPBtn");
        const originalBtnText = verifyOTPBtn.innerHTML;
        verifyOTPBtn.disabled = true;
        verifyOTPBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Verifying...`;

        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: pendingRegisterData.name,
                email: pendingRegisterData.email,
                phone: pendingRegisterData.phone,
                location: pendingRegisterData.location,
                password: pendingRegisterData.password,
                otp: otp
            })
        });

        const data = await response.json();
        
        verifyOTPBtn.disabled = false;
        verifyOTPBtn.innerHTML = originalBtnText;

        if (data.success) {
            showPremiumNotification("Success", data.message || "Registration and verification successful!", false);
            
            // Clean up stored pending registers
            closeOTPModal();
            pendingRegisterData = null;

            // Save JWT Session Data
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userPhone", data.user.phone || "");
            localStorage.setItem("userLocation", data.user.location || "");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            showPremiumNotification("Verification Failed", data.message || "Invalid OTP code entered.", true);
            // Clear inputs for re-entry
            clearOTPInputs();
        }
    } catch (error) {
        console.error("Error during register confirmation:", error);
        showPremiumNotification("Server Connection Issue", "Could not complete registration. Check server status.", true);
        const verifyOTPBtn = document.getElementById("verifyOTPBtn");
        if (verifyOTPBtn) {
            verifyOTPBtn.disabled = false;
            verifyOTPBtn.innerHTML = "Verify & Register";
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
            // Clean value to allow only single digit numbers
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

        // Add paste listener to the first input for copy-pasting convenience
        if (i === 1) {
            currentInput.addEventListener("paste", (e) => {
                const pasteData = (e.clipboardData || window.clipboardData).getData("text").trim();
                if (/^[0-9]{6}$/.test(pasteData)) {
                    e.preventDefault();
                    for (let j = 0; j < 6; j++) {
                        const cell = document.getElementById(`otp_${j + 1}`);
                        if (cell) cell.value = pasteData[j];
                    }
                    // Auto focus verify button
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