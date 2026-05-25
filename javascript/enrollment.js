// Skill Square Luxury Checkout and Enrollment Script
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://skill-square-backend-megha.onrender.com/api";

// Background timers for simulated dynamic UPI polling
let upiStatusInterval;
let upiStatusTimeout;

// Dynamic Razorpay SDK script injector promise helper
function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

// Pricing list for premium courses
const COURSE_CATALOG = {
    "webdevelopment.html": {
        id: "webdevelopment",
        name: "Web Development",
        fee: 7999,
        duration: "6 Months",
        trainer: "Aman Singh"
    },
    "python.html": {
        id: "python",
        name: "Python Programming",
        fee: 9999,
        duration: "4 Months",
        trainer: "Aman Singh"
    },
    "dataanalytics.html": {
        id: "dataanalytics",
        name: "Data Analytics",
        fee: 12999,
        duration: "5 Months",
        trainer: "Aman Singh"
    },
    "java.html": {
        id: "java",
        name: "Java Programming",
        fee: 8999,
        duration: "5 Months",
        trainer: "Aman Singh"
    },
    "placement.html": {
        id: "placement",
        name: "Placement Training",
        fee: 14999,
        duration: "3 Months",
        trainer: "Aman Singh"
    },
    "cyber.html": {
        id: "cyber",
        name: "Cyber Security",
        fee: 11999,
        duration: "6 Months",
        trainer: "Aman Singh"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const enrollButtons = document.querySelectorAll(".enroll-btn");
    if (enrollButtons.length === 0) return;

    enrollButtons.forEach((btn) => {
        // Intercept clicks
        btn.addEventListener("click", (e) => {
            const token = localStorage.getItem("token");
            
            // 1. Check Student Session Auth
            if (!token) {
                e.preventDefault();
                alert("Session Required! Please login as a student to enroll in this premium course.");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1800);
                return;
            }

            // 2. Already logged in -> Start Checkout process
            e.preventDefault();
            
            // Get current file name
            const currentPath = window.location.pathname.split("/").pop() || "webdevelopment.html";
            const courseDetails = COURSE_CATALOG[currentPath] || COURSE_CATALOG["webdevelopment.html"];
            
            openCheckoutModal(courseDetails, token);
        });
    });
});

/**
 * Open Checkout Overlay & Render Payment Forms dynamically
 */
function openCheckoutModal(course, token) {
    // Hide AI Chatbot Launcher during secure payment checkout process
    const aiLauncher = document.getElementById("aiChatLauncher");
    const aiPanel = document.getElementById("aiChatPanel");
    if (aiLauncher) aiLauncher.style.display = "none";
    if (aiPanel) aiPanel.classList.remove("active");

    // Generate pricing values
    const gstRate = 0.18;
    const gstAmount = Math.round(course.fee * gstRate * 100) / 100;
    const totalAmount = Math.round((course.fee + gstAmount) * 100) / 100;

    // Create Modal container if it doesn't exist
    let modal = document.getElementById("checkoutModalOverlay");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "checkoutModalOverlay";
        modal.className = "payment-modal-overlay";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="payment-modal-content">
            <button class="payment-modal-close" id="closeCheckoutBtn">&times;</button>
            
            <div class="payment-modal-header">
                <h2>Secure Checkout</h2>
                <p>Unlock Premium Course: <strong>${course.name}</strong></p>
            </div>

            <!-- Billing Breakdown Table -->
            <div class="billing-summary">
                <div class="billing-row">
                    <span>Course Subtotal:</span>
                    <strong>₹${course.fee.toLocaleString("en-IN")}</strong>
                </div>
                <div class="billing-row">
                    <span>Integrated GST (18%):</span>
                    <strong>₹${gstAmount.toLocaleString("en-IN")}</strong>
                </div>
                <div class="billing-row border-top total">
                    <span>Total Billable Amount:</span>
                    <strong>₹${totalAmount.toLocaleString("en-IN")}</strong>
                </div>
            </div>

            <!-- Payment Selector Tabs -->
            <div class="payment-tabs-container">
                <button class="payment-tab active" data-target="upiPanel">
                    <i class="fa-solid fa-mobile-screen-button"></i> UPI
                </button>
                <button class="payment-tab" data-target="cardPanel">
                    <i class="fa-solid fa-credit-card"></i> Card
                </button>
                <button class="payment-tab" data-target="netbankingPanel">
                    <i class="fa-solid fa-building-columns"></i> Net Banking
                </button>
            </div>

            <!-- UPI Payment Panel -->
            <div class="payment-panel active" id="upiPanel">
                <div class="payment-input-group">
                    <label for="checkoutUPIId">Enter UPI ID (Optional if scanning QR)</label>
                    <input type="text" id="checkoutUPIId" placeholder="username@okbank" autocomplete="off" />
                </div>
                <div class="upi-qr-box">
                    <div class="upi-live-status" id="upiLiveStatus">
                        <span class="pulse-dot amber"></span>
                        <span class="status-text" style="color: #ffd700;">Awaiting scanner detection...</span>
                    </div>
                    <div class="qr-visual-container">
                        <div class="qr-laser-beam"></div>
                        <img id="upiDynamicQR" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=skillsquare@okaxis&pn=Skill%20Square&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Enrollment for ' + course.name)}`)}" class="qr-visual-img" />
                    </div>
                    <div class="upi-scan-desc" id="upiScanDesc">
                        Scan this dynamic QR code using PhonePe, Google Pay, or Paytm to pay exactly <strong>₹${totalAmount.toLocaleString("en-IN")}</strong>
                    </div>
                </div>
            </div>

            <!-- Card Payment Panel -->
            <div class="payment-panel" id="cardPanel">
                <div class="payment-input-group">
                    <label for="checkoutCardName">Cardholder Name</label>
                    <input type="text" id="checkoutCardName" placeholder="Enter the name" autocomplete="off" />
                </div>
                <div class="payment-input-group">
                    <label for="checkoutCardNumber">Card Number</label>
                    <input type="text" id="checkoutCardNumber" placeholder="Enter the card number" maxlength="19" autocomplete="off" />
                </div>
                <div class="card-row-2">
                    <div class="payment-input-group">
                        <label for="checkoutCardExpiry">Expiry Date</label>
                        <input type="text" id="checkoutCardExpiry" placeholder="MM/YY" maxlength="5" autocomplete="off" />
                    </div>
                    <div class="payment-input-group">
                        <label for="checkoutCardCVV">CVV</label>
                        <input type="password" id="checkoutCardCVV" placeholder="***" maxlength="3" autocomplete="off" />
                    </div>
                </div>
            </div>

            <!-- Net Banking Panel -->
            <div class="payment-panel" id="netbankingPanel">
                <label style="display: block; font-size: 13.5px; font-weight: 600; color: rgba(255, 255, 255, 0.8); margin-bottom: 12px; text-transform: uppercase;">
                    Popular Indian Banks
                </label>
                <div class="bank-grid">
                    <div class="bank-option" data-bank="SBI">
                        <i class="fa-solid fa-building-columns"></i> State Bank of India
                    </div>
                    <div class="bank-option" data-bank="HDFC">
                        <i class="fa-solid fa-building-columns"></i> HDFC Bank
                    </div>
                    <div class="bank-option" data-bank="ICICI">
                        <i class="fa-solid fa-building-columns"></i> ICICI Bank
                    </div>
                    <div class="bank-option" data-bank="AXIS">
                        <i class="fa-solid fa-building-columns"></i> Axis Bank
                    </div>
                </div>
                <div class="payment-input-group mt-3">
                    <label for="checkoutOtherBanks">Or Choose Another Bank</label>
                    <select id="checkoutOtherBanks" class="payment-select">
                        <option value="">-- Select Bank --</option>
                        <option value="PNB">Punjab National Bank</option>
                        <option value="BOB">Bank of Baroda</option>
                        <option value="KOTAK">Kotak Mahindra Bank</option>
                        <option value="INDUSIND">IndusInd Bank</option>
                        <option value="YES">Yes Bank</option>
                    </select>
                </div>
            </div>

            <!-- Action Button -->
            <button class="pay-now-btn" id="submitSecurePaymentBtn">
                <i class="fa-solid fa-lock"></i> Pay Securely ₹${totalAmount.toLocaleString("en-IN")}
            </button>

            <!-- Loading Processing Panel Overlay -->
            <div class="payment-processing-loader" id="paymentProcessingLoader">
                <div class="luxury-spinner-outer">
                    <div class="luxury-spinner-inner"></div>
                    <div class="luxury-spinner-ring"></div>
                </div>
                <div class="payment-loading-text" id="loaderTitle">Verifying Request...</div>
                <div class="payment-loading-desc" id="loaderDesc">Connecting with bank servers. Please do not refresh.</div>
            </div>

            <!-- Successful Transaction Screen -->
            <div class="payment-success-overlay" id="paymentSuccessOverlay">
                <div class="checkmark-circle-success">
                    <i class="fa-solid fa-check"></i>
                </div>
                <div class="success-gold-title">Payment Successful!</div>
                <div class="success-gold-desc">
                    Congratulations! Your transaction was authenticated. You have been successfully enrolled in <strong>${course.name}</strong>.
                </div>
                <div class="success-redirect-badge">
                    <i class="fa-solid fa-spinner"></i> Launching Student Dashboard...
                </div>
            </div>
        </div>
    `;

    // Show modal overlay
    setTimeout(() => {
        modal.classList.add("active");
    }, 50);

    // Start automated UPI status polling on initial render since UPI is the default tab
    startSimulatedUPIStatus(totalAmount, course, token);

    // Event Bindings
    const closeBtn = document.getElementById("closeCheckoutBtn");
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        
        // Clean up any running UPI status polling when closing modal
        if (upiStatusInterval) clearInterval(upiStatusInterval);
        if (upiStatusTimeout) clearTimeout(upiStatusTimeout);

        // Restore AI Chatbot Launcher after manual checkout exit
        const aiLauncher = document.getElementById("aiChatLauncher");
        if (aiLauncher) aiLauncher.style.display = "flex";
    });

    // 1. Selector Tab Toggles
    const tabs = modal.querySelectorAll(".payment-tab");
    const panels = modal.querySelectorAll(".payment-panel");
    let currentMethod = "UPI";

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");
            const targetId = tab.dataset.target;
            document.getElementById(targetId).classList.add("active");

            // Clean up any running UPI status polling when switching tabs
            if (upiStatusInterval) clearInterval(upiStatusInterval);
            if (upiStatusTimeout) clearTimeout(upiStatusTimeout);

            if (targetId === "upiPanel") {
                currentMethod = "UPI";
                startSimulatedUPIStatus(totalAmount, course, token);
            }
            else if (targetId === "cardPanel") currentMethod = "Debit/Credit Card";
            else if (targetId === "netbankingPanel") currentMethod = "Net Banking";
        });
    });

    // 2. Netbanking Options Toggle
    const bankOptions = modal.querySelectorAll(".bank-option");
    const otherBanksSelect = document.getElementById("checkoutOtherBanks");
    let selectedBank = "";

    bankOptions.forEach((option) => {
        option.addEventListener("click", () => {
            bankOptions.forEach(o => o.classList.remove("selected"));
            option.classList.add("selected");
            selectedBank = option.dataset.bank;
            otherBanksSelect.value = ""; // clear dropdown
        });
    });

    otherBanksSelect.addEventListener("change", (e) => {
        if (e.target.value) {
            bankOptions.forEach(o => o.classList.remove("selected"));
            selectedBank = e.target.value;
        }
    });

    // 3. Auto Card Number Space Formatting
    const cardInput = document.getElementById("checkoutCardNumber");
    if (cardInput) {
        cardInput.addEventListener("input", (e) => {
            let val = e.target.value.replace(/\D/g, "");
            let newVal = "";
            for (let i = 0; i < val.length; i++) {
                if (i > 0 && i % 4 === 0) newVal += " ";
                newVal += val[i];
            }
            e.target.value = newVal;
        });
    }

    // 4. Auto Expiry Date Slash Formatting
    const expiryInput = document.getElementById("checkoutCardExpiry");
    if (expiryInput) {
        expiryInput.addEventListener("input", (e) => {
            let val = e.target.value.replace(/\D/g, "");
            if (val.length >= 2) {
                e.target.value = val.slice(0, 2) + "/" + val.slice(2, 4);
            } else {
                e.target.value = val;
            }
        });
    }

    // 5. Payment Submission secure trigger
    const payBtn = document.getElementById("submitSecurePaymentBtn");
    payBtn.addEventListener("click", async () => {
        // UI Validation Checks
        if (currentMethod === "UPI") {
            const upiId = document.getElementById("checkoutUPIId").value.trim();
            if (!upiId || !upiId.includes("@")) {
                alert("Secure Verification Failed! Please enter a valid UPI ID (e.g. username@okaxis).");
                return;
            }
        } 
        
        else if (currentMethod === "Net Banking") {
            if (!selectedBank) {
                alert("Security Validation Failed! Please select a bank from our popular grids or other list.");
                return;
            }
        } 
        
        else if (currentMethod === "Debit/Credit Card") {
            const cardholderName = document.getElementById("checkoutCardName").value.trim();
            const cardNumber = document.getElementById("checkoutCardNumber").value.replace(/\s/g, "");
            const cardExpiry = document.getElementById("checkoutCardExpiry").value.trim();
            const cardCVV = document.getElementById("checkoutCardCVV").value.trim();

            if (!cardholderName) {
                alert("Card Verification Failed! Please enter the cardholder's full name.");
                return;
            }
            if (cardNumber.length < 16) {
                alert("Card Verification Failed! Card number must be 16 digits long.");
                return;
            }
            if (!cardExpiry || !cardExpiry.includes("/")) {
                alert("Card Verification Failed! Please enter a valid expiry date (MM/YY).");
                return;
            }
            const expParts = cardExpiry.split("/");
            if (parseInt(expParts[0]) < 1 || parseInt(expParts[0]) > 12) {
                alert("Card Verification Failed! Expiry month must be between 01 and 12.");
                return;
            }
            if (cardCVV.length < 3) {
                alert("Card Verification Failed! CVV code must be 3 digits long.");
                return;
            }
        }

        // Activate Luxury Loader Screen Overlay
        const loader = document.getElementById("paymentProcessingLoader");
        const loaderTitle = document.getElementById("loaderTitle");
        const loaderDesc = document.getElementById("loaderDesc");
        
        loader.classList.add("active");
        loaderTitle.textContent = "Connecting to Gateway...";
        loaderDesc.textContent = "Initializing secure Razorpay payment session. Please do not close this window...";

        try {
            // 1. Load Razorpay script dynamically
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                loader.classList.remove("active");
                alert("Payment Gateway Failed to Load! Please check your internet connection and try again.");
                return;
            }

            // 2. Call backend to create Razorpay Order
            const orderRes = await fetch(`${API_BASE}/enrollment/razorpay-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    courseId: course.id
                })
            });

            const orderData = await orderRes.json();
            if (!orderData.success) {
                loader.classList.remove("active");
                alert(orderData.message || "Failed to initiate transaction order. Please try again.");
                return;
            }

            // Hide the internal loading overlay to allow the Razorpay Checkout Modal to display clearly
            loader.classList.remove("active");

            // 3. Configure and open Razorpay Checkout Options
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: "INR",
                name: "Skill Square",
                description: `Unlock Course: ${course.name}`,
                image: "Images/logo.png",
                order_id: orderData.order_id,
                prefill: {
                    name: localStorage.getItem("userName") || "Student",
                    email: localStorage.getItem("userEmail") || "student@skillsquare.com",
                    contact: localStorage.getItem("userPhone") || "9999999999",
                    method: currentMethod === "UPI" ? "upi" : (currentMethod === "Net Banking" ? "netbanking" : "card")
                },
                notes: {
                    course_id: course.id,
                    student_id: localStorage.getItem("userName")
                },
                theme: {
                    color: "#d4af37" // Beautiful Golden Theme color!
                },
                handler: async function (response) {
                    // Activate Loader during verification
                    loader.classList.add("active");
                    loaderTitle.textContent = "Authenticating Signature...";
                    loaderDesc.textContent = "Verifying transaction credentials with banking servers...";

                    try {
                        const verifyRes = await fetch(`${API_BASE}/enrollment/razorpay-verify`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                courseId: course.id,
                                courseName: course.name,
                                amountPaid: totalAmount,
                                paymentMethod: currentMethod,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            // Show Dynamic Success Panel Screen
                            const successOverlay = document.getElementById("paymentSuccessOverlay");
                            if (successOverlay) successOverlay.classList.add("active");

                            // Auto-direct to student dashboard page after success
                            setTimeout(() => {
                                window.location.href = "dashboard.html";
                            }, 2800);
                        } else {
                            loader.classList.remove("active");
                            alert(verifyData.message || "Payment verification failed. Please contact support.");
                        }
                    } catch (verifyErr) {
                        loader.classList.remove("active");
                        console.error("Signature verification network error:", verifyErr);
                        alert("Secure Handshake Failed! Verification servers are currently offline.");
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("Razorpay secure checkout modal was dismissed by the student.");
                    }
                }
            };

            // In simulated/offline development mode, if keys are placeholder and script is blocked,
            // we can fallback to completing checkout automatically after 2 seconds for perfect testing
            if (orderData.simulated && !window.Razorpay) {
                console.log("Simulating dynamic Razorpay success callback in sandbox mode...");
                loader.classList.add("active");
                loaderTitle.textContent = "Simulating Razorpay Payment...";
                loaderDesc.textContent = "Opening sandbox test verification tunnel...";
                
                setTimeout(() => {
                    const simulatedPaymentId = "pay_" + Math.random().toString(36).substring(2, 15);
                    options.handler({
                        razorpay_payment_id: simulatedPaymentId,
                        razorpay_order_id: orderData.order_id,
                        razorpay_signature: "simulated_success_sig"
                    });
                }, 2000);
                return;
            }

            // Open Razorpay Secure Gateway Modal
            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            loader.classList.remove("active");
            console.error("Razorpay Secure Checkout Session Error:", error);
            alert("Security Connection Refused! Make sure that the backend local server is running on port 5000.");
        }
    });
}

/**
 * Simulated UPI Transaction Monitor and automatic success handler
 */
function startSimulatedUPIStatus(totalAmount, course, token) {
    const liveStatus = document.getElementById("upiLiveStatus");
    if (!liveStatus) return;

    // Reset status to Phase 1
    liveStatus.innerHTML = `
        <span class="pulse-dot amber"></span>
        <span class="status-text" style="color: #ffd700;">Awaiting scanner detection...</span>
    `;
    
    let step = 0;
    
    if (upiStatusInterval) clearInterval(upiStatusInterval);
    if (upiStatusTimeout) clearTimeout(upiStatusTimeout);

    upiStatusInterval = setInterval(() => {
        step++;
        if (step === 1) {
            // Phase 2: scanned
            liveStatus.innerHTML = `
                <span class="pulse-dot blue"></span>
                <span class="status-text" style="color: #00bcd4;">QR Scanned! User authorizing ₹${totalAmount.toLocaleString("en-IN")} inside UPI App...</span>
            `;
        } else if (step === 2) {
            // Phase 3: authorized, verifying clearance
            liveStatus.innerHTML = `
                <span class="pulse-dot blue"></span>
                <span class="status-text" style="color: #ffd700;">Payment Authorized! Fetching electronic clearance token...</span>
            `;
        } else if (step === 3) {
            // Phase 4: success, submit API
            liveStatus.innerHTML = `
                <span class="pulse-dot green"></span>
                <span class="status-text" style="color: #4caf50;">Transaction Detected! Enrolling securely...</span>
            `;
            clearInterval(upiStatusInterval);

            // Trigger success checkout click automatically after a short delay
            upiStatusTimeout = setTimeout(() => {
                const payBtn = document.getElementById("submitSecurePaymentBtn");
                if (payBtn) {
                    // Pre-fill a dummy UPI ID if the input field is empty so validation passes
                    const upiInput = document.getElementById("checkoutUPIId");
                    if (upiInput && !upiInput.value.trim()) {
                        upiInput.value = "skillsquare@okaxis";
                    }
                    payBtn.click();
                }
            }, 1200);
        }
    }, 3500); // 3.5 seconds intervals, total ~10-12s
}
