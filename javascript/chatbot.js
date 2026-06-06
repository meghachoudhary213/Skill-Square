(function() {
// Skill Square Luxury AI Assistant Chatbot
// Fully self-contained text, voice-to-text, and vocal text-to-speech engine

// Inject dynamic high-fidelity CSS styling directly to bypass browser caching issues completely
(function() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .ai-chat-launcher {
            position: fixed !important;
            bottom: 100px !important;
            right: 30px !important;
            width: 52px !important;
            height: 52px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #ffe066 0%, #d4af37 50%, #aa7c11 100%) !important;
            color: black !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            cursor: pointer !important;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.55), 0 0 15px rgba(212, 175, 55, 0.4) !important;
            z-index: 999999 !important;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            border: 2px solid #000000 !important;
            overflow: hidden !important;
            white-space: nowrap !important;
            padding: 0 !important;
            animation: launcherBreathing 3s infinite alternate !important;
        }
        
        .ai-chat-launcher.active {
            width: auto !important;
            border-radius: 26px !important;
            padding: 0 20px !important;
        }
        
        .ai-chat-launcher .launcher-text {
            display: none !important;
            margin-left: 8px !important;
            font-size: 14px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            animation: fadeInText 0.3s ease forwards !important;
        }
        
        .ai-chat-launcher.active .launcher-text {
            display: inline-block !important;
        }
        
        @keyframes fadeInText {
            from { opacity: 0; transform: translateX(-5px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes launcherBreathing {
            0% {
                transform: scale(1);
                box-shadow: 0 10px 30px rgba(255, 215, 0, 0.55), 0 0 15px rgba(212, 175, 55, 0.4) !important;
            }
            100% {
                transform: scale(1.06);
                box-shadow: 0 10px 35px rgba(255, 215, 0, 0.75), 0 0 25px rgba(212, 175, 55, 0.6) !important;
            }
        }
        
        .ai-chat-launcher:hover {
            transform: scale(1.1) translateY(-3px) !important;
            background: #ffffff !important;
            color: #000000 !important;
            border-color: #d4af37 !important;
            box-shadow: 0 15px 35px rgba(255, 215, 0, 0.7) !important;
        }
        
        .ai-chat-launcher i {
            font-size: 18px !important;
            color: black !important;
            transition: transform 0.5s ease !important;
            z-index: 2 !important;
        }
        
        .ai-chat-launcher:hover i {
            transform: rotate(360deg) !important;
        }
        
        .ai-chat-panel {
            position: fixed !important;
            bottom: 165px !important;
            right: 30px !important;
            width: 370px !important;
            height: 500px !important;
            border-radius: 24px !important;
            background: rgba(10, 10, 10, 0.95) !important;
            border: 2px solid #d4af37 !important;
            display: none;
            flex-direction: column !important;
            overflow: hidden !important;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.25) !important;
            backdrop-filter: blur(15px) !important;
            -webkit-backdrop-filter: blur(15px) !important;
            z-index: 999999 !important;
            animation: slideUpChatPanel 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        
        @keyframes slideUpChatPanel {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .ai-chat-panel.active {
            display: flex !important;
        }
        
        .ai-chat-header {
            background: rgba(0, 0, 0, 0.6) !important;
            padding: 16px 20px !important;
            border-bottom: 1.5px solid rgba(255, 215, 0, 0.15) !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        
        .ai-chat-header-info {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }
        
        .ai-chat-avatar {
            width: 38px !important;
            height: 38px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #ffe066 0%, #d4af37 50%, #aa7c11 100%) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.25) !important;
        }
        
        .ai-chat-avatar i {
            color: black !important;
            font-size: 16px !important;
        }
        
        .ai-chat-header-text h4 {
            color: white !important;
            font-size: 15.5px !important;
            font-weight: 700 !important;
            margin-bottom: 2px !important;
            margin-top: 0 !important;
        }
        
        .ai-chat-header-text span {
            color: #d4af37 !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            display: flex !important;
            align-items: center !important;
            gap: 5px !important;
        }
        
        .ai-chat-header-text span::before {
            content: '' !important;
            display: inline-block !important;
            width: 6px !important;
            height: 6px !important;
            background: #00ff66 !important;
            border-radius: 50% !important;
            box-shadow: 0 0 6px #00ff66 !important;
        }
        
        .ai-chat-close {
            background: transparent !important;
            border: none !important;
            color: rgba(255, 255, 255, 0.65) !important;
            font-size: 20px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }
        
        .ai-chat-close:hover {
            color: white !important;
            transform: rotate(90deg) !important;
        }
        
        .ai-chat-messages {
            flex: 1 !important;
            padding: 20px !important;
            overflow-y: auto !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 15px !important;
        }
        
        .ai-bubble {
            max-width: 80% !important;
            padding: 12px 16px !important;
            border-radius: 16px !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            position: relative !important;
            animation: bubblePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.15) both !important;
        }
        
        @keyframes bubblePop {
            from { transform: scale(0.85); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .ai-bubble.bot {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: rgba(255, 255, 255, 0.95) !important;
            align-self: flex-start !important;
            border-bottom-left-radius: 4px !important;
        }
        
        .ai-bubble.user {
            background: linear-gradient(135deg, #ffe066 0%, #d4af37 50%, #aa7c11 100%) !important;
            color: black !important;
            font-weight: 550 !important;
            align-self: flex-end !important;
            border-bottom-right-radius: 4px !important;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.15) !important;
        }
        
        .ai-chat-footer {
            padding: 15px 20px !important;
            background: rgba(0, 0, 0, 0.5) !important;
            border-top: 1.5px solid rgba(255, 215, 0, 0.15) !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }
        
        .ai-chat-input-wrapper {
            flex: 1 !important;
            position: relative !important;
            display: flex !important;
            align-items: center !important;
        }
        
        .ai-chat-input {
            width: 100% !important;
            background: rgba(0, 0, 0, 0.7) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
            color: white !important;
            padding: 12px 16px !important;
            border-radius: 30px !important;
            font-size: 14px !important;
            outline: none !important;
            transition: all 0.3s ease !important;
        }
        
        .ai-chat-input:focus {
            border-color: #d4af37 !important;
            box-shadow: 0 0 12px rgba(255, 215, 0, 0.25) !important;
            background: rgba(0, 0, 0, 0.85) !important;
        }
        
        .ai-chat-action-btn {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.08) !important;
            color: rgba(255, 255, 255, 0.65) !important;
            width: 38px !important;
            height: 38px !important;
            border-radius: 50% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }
        
        .ai-chat-action-btn:hover {
            background: rgba(255, 215, 0, 0.1) !important;
            border-color: #d4af37 !important;
            color: #ffe066 !important;
            transform: translateY(-2px) !important;
        }
        
        .ai-chat-action-btn.active {
            background: linear-gradient(135deg, #ffe066 0%, #d4af37 50%, #aa7c11 100%) !important;
            color: black !important;
            border-color: #d4af37 !important;
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3) !important;
        }
        
        .ai-chat-action-btn.listening {
            background: #ff3333 !important;
            color: white !important;
            border-color: #ff3333 !important;
            box-shadow: 0 0 15px #ff3333 !important;
            animation: micPulse 1.2s infinite !important;
        }
        
        @keyframes micPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.12); }
            100% { transform: scale(1); }
        }
        
        .ai-chat-send {
            background: linear-gradient(135deg, #ffe066 0%, #d4af37 50%, #aa7c11 100%) !important;
            color: black !important;
            border: none !important;
            width: 38px !important;
            height: 38px !important;
            border-radius: 50% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            cursor: pointer !important;
            box-shadow: 0 4px 10px rgba(255, 215, 0, 0.15) !important;
            transition: all 0.3s ease !important;
        }
        
        .ai-chat-send:hover {
            background: white !important;
            transform: scale(1.08) !important;
            box-shadow: 0 6px 15px rgba(255, 215, 0, 0.35) !important;
        }
        
        .ai-chat-send i {
            font-size: 14px !important;
        }
        
        /* Responsive Media Queries for Tablets and Mobiles */
        @media (max-width: 768px) {
            .ai-chat-launcher {
                bottom: 85px !important;
                right: 20px !important;
            }
            .ai-chat-panel {
                bottom: 150px !important;
                right: 20px !important;
                width: calc(100% - 40px) !important;
                height: 450px !important;
            }
        }
        @media (max-width: 480px) {
            .ai-chat-launcher {
                bottom: 85px !important;
                right: 15px !important;
                width: 48px !important;
                height: 48px !important;
            }
            .ai-chat-panel {
                bottom: 145px !important;
                right: 15px !important;
                width: calc(100% - 30px) !important;
                height: 400px !important;
            }
        }
    `;
    document.head.appendChild(styleSheet);
})();

const BOT_KNOWLEDGE = {
    courses: {
        keywords: ["course", "courses", "syllabus", "subject", "learn", "fees", "fee", "price", "pricing", "cost"],
        response: `We offer 6 premium industry-accredited courses at Skill Square:
1. <b>Web Development</b>: ₹7,999 (Duration: 6 Months)
2. <b>Python Programming</b>: ₹9,999 (Duration: 4 Months)
3. <b>Java Programming</b>: ₹8,999 (Duration: 5 Months)
4. <b>Data Analytics</b>: ₹12,999 (Duration: 5 Months)
5. <b>Placement Training</b>: ₹14,999 (Duration: 3 Months)
6. <b>Cyber Security</b>: ₹11,999 (Duration: 6 Months)

All courses are certified and mentored by Aman Singh. GST (18%) is calculated dynamically at checkout.`
    },
    webdev: {
        keywords: ["web", "development", "html", "css", "js", "javascript", "react", "bootstrap"],
        response: `Our <b>Web Development Course</b> costs ₹7,999 and runs for 6 months. It covers HTML5, CSS3, JavaScript, Bootstrap, React.js, and backend integration. It includes hands-on projects, industry certification, and full placement support.`
    },
    python: {
        keywords: ["python", "django", "flask", "scripting"],
        response: `Our <b>Python Programming Course</b> costs ₹9,999 and runs for 4 months. You will master Python fundamentals, OOP concepts, file handling, libraries like NumPy/Pandas, and scripting. Perfect for beginners and software roles.`
    },
    java: {
        keywords: ["java", "oop", "springboot", "collections"],
        response: `Our <b>Java Programming Course</b> costs ₹8,999 and runs for 5 months. It focuses heavily on Object-Oriented Programming (OOP) architectures, exception handling, multithreading, collections framework, and mini-applications development.`
    },
    data: {
        keywords: ["data", "analyst", "analytics", "sql", "excel", "powerbi", "visualization"],
        response: `Our <b>Data Analytics Course</b> costs ₹12,999 and runs for 5 months. It covers Excel macros, SQL querying, Power BI dashboards, data cleaning, and statistical visualizations. Includes real-world business case studies.`
    },
    placement: {
        keywords: ["placement", "job", "guarantee", "career", "interview", "resume", "aptitude"],
        response: `Our <b>Placement Training Course</b> costs ₹14,999 and runs for 3 months. It provides complete interview preparations, mock interviews, aptitude testing, resume building workshops, and direct hiring connect with our premium recruiting partners.`
    },
    cyber: {
        keywords: ["cyber", "security", "hacking", "ethical", "network", "firewall"],
        response: `Our <b>Cyber Security Course</b> costs ₹11,999 and runs for 6 months. You will learn ethical hacking, system networking security, firewalls, penetration testing, and digital protection. Designed for security engineer roles.`
    },
    mentor: {
        keywords: ["trainer", "teacher", "mentor", "faculty", "aman", "singh"],
        response: `Our courses are led by <b>Aman Singh</b>, an industry-certified engineering professional with extensive coaching expertise and hands-on developer experience.`
    },
    general: {
        keywords: ["hello", "hi", "hey", "who are you", "help"],
        response: `Hello! 👋 Welcome to Skill Square AI Assistant. I can assist you with details about our premium courses, fees, curriculums, placement support, or secure checkout questions. Feel free to type or ask via voice!`
    }
};

if (window.aiChatbotInitialized) {
    console.log("Skill Square AI Chatbot already initialized. Skipping execution.");
    return;
}
window.aiChatbotInitialized = true;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        // 1. Inject Chatbot Launcher & Panel HTML into DOM dynamically
        injectChatbotDOM();

        // 2. Chatbot Logic & Speech controllers
        initChatbotSystem();

        // 3. Inject Navigation Links dynamically into Header Navbar / Sidebars
        injectNavigationLinks();
    });
} else {
    // DOM is already ready, inject immediately!
    injectChatbotDOM();
    initChatbotSystem();
    injectNavigationLinks();
}

function injectChatbotDOM() {
    // Double injection guard
    if (document.getElementById("aiChatLauncher")) return;
 
    // Launcher Button
    const launcher = document.createElement("div");
    launcher.id = "aiChatLauncher";
    launcher.className = "ai-chat-launcher";
    launcher.title = "Ask Skill Square AI";
    launcher.innerHTML = `<i class="fa-solid fa-robot" style="font-size: 18px;"></i><span class="launcher-text">Ask AI</span>`;
    document.body.appendChild(launcher);
 
    // Chat Panel
    const panel = document.createElement("div");
    panel.id = "aiChatPanel";
    panel.className = "ai-chat-panel";
    panel.innerHTML = `
        <div class="ai-chat-header">
            <div class="ai-chat-header-info">
                <div class="ai-chat-avatar">
                    <i class="fa-solid fa-robot"></i>
                </div>
                <div class="ai-chat-header-text">
                    <h4>Ask AI - Assistant</h4>
                    <span>Online & Listening</span>
                </div>
            </div>
            <button class="ai-chat-close" id="closeAIChatBtn">&times;</button>
        </div>

        <div class="ai-chat-messages" id="aiChatMessages">
            <div class="ai-bubble bot">
                Hello! 👋 Welcome to Skill Square. I am your custom AI query assistant. Ask me anything about our premium courses, syllabus details, or payment checkout!
            </div>
        </div>

        <div class="ai-chat-footer">
            <!-- Voice Back synthesis toggle -->
            <button class="ai-chat-action-btn" id="aiVoiceBackToggle" title="Enable Voice Responses">
                <i class="fa-solid fa-volume-high"></i>
            </button>
            
            <div class="ai-chat-input-wrapper">
                <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Type a query..." autocomplete="off" />
            </div>

            <!-- Voice Recognition input -->
            <button class="ai-chat-action-btn" id="aiSpeechRecBtn" title="Speak Query (Voice Recognition)">
                <i class="fa-solid fa-microphone"></i>
            </button>

            <!-- Send button -->
            <button class="ai-chat-send" id="aiSendChatBtn" title="Send Message">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    `;
    document.body.appendChild(panel);
}

function injectNavigationLinks() {
    // 1. Check if Navbar lists exist
    const mainNavs = document.querySelectorAll(".navbar-nav, #mainNavbarList");
    mainNavs.forEach(nav => {
        if (nav.querySelector(".nav-ask-ai-item")) return; // Prevent double injection!
        
        const li = document.createElement("li");
        li.className = "nav-item nav-ask-ai-item";
        li.innerHTML = `
            <a class="nav-link" href="#" style="color: #ffe066 !important; font-weight: 800 !important; display: flex !important; align-items: center !important; gap: 6px !important; border: 1.5px solid #d4af37 !important; padding: 6px 12px !important; border-radius: 20px !important; background: rgba(212, 175, 55, 0.1) !important; margin: 4px 6px !important; transition: all 0.3s ease !important; text-transform: uppercase !important; font-size: 12px !important; letter-spacing: 0.5px !important;" onmouseover="this.style.background='white'; this.style.color='black'; this.style.borderColor='white'" onmouseout="this.style.background='rgba(212, 175, 55, 0.1)'; this.style.color='#ffe066'; this.style.borderColor='#d4af37'">
                <i class="fa-solid fa-robot"></i> Ask AI
                <span class="badge bg-warning text-dark" style="font-size: 9px !important; padding: 2px 5px !important; border-radius: 4px !important; font-weight: 900 !important; line-height: 1 !important;">LIVE</span>
            </a>
        `;
        
        // Find Login/Register buttons or append to the end
        const loginOrRegister = nav.querySelector("a[href*='login.html'], a[href*='register.html']");
        if (loginOrRegister && loginOrRegister.parentElement && loginOrRegister.parentElement.parentElement === nav) {
            nav.insertBefore(li, loginOrRegister.parentElement);
        } else {
            nav.appendChild(li);
        }
        
        li.querySelector("a").addEventListener("click", (e) => {
            e.preventDefault();
            const panel = document.getElementById("aiChatPanel");
            const launcher = document.getElementById("aiChatLauncher");
            if (panel) {
                panel.classList.toggle("active");
                if (launcher) launcher.classList.toggle("active", panel.classList.contains("active"));
                const messagesContainer = document.getElementById("aiChatMessages");
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }
        });
    });

    // 2. Check if Dashboard Sidebars exist
    const sidebars = document.querySelectorAll(".sidebar ul, .sidebar-menu");
    sidebars.forEach(sidebar => {
        if (sidebar.querySelector(".sidebar-ask-ai-item")) return; // Prevent double injection!
        
        const li = document.createElement("li");
        li.className = "sidebar-ask-ai-item";
        li.style.marginTop = "10px"; // Give some breathing room
        li.innerHTML = `
            <a href="#" style="color: #ffe066 !important; font-weight: 700 !important; display: flex !important; align-items: center !important; gap: 10px !important; border: 1.5px dashed #d4af37 !important; padding: 12px 18px !important; border-radius: 12px !important; background: rgba(212, 175, 55, 0.05) !important; transition: all 0.3s ease !important; text-decoration: none !important; font-size: 14px !important;" onmouseover="this.style.background='rgba(212, 175, 55, 0.2)'; this.style.color='white';" onmouseout="this.style.background='rgba(212, 175, 55, 0.05)'; this.style.color='#ffe066';">
                <i class="fa-solid fa-robot"></i>
                <span>Ask AI</span>
                <span class="badge bg-warning text-dark" style="font-size: 9px !important; padding: 2px 5px !important; border-radius: 4px !important; font-weight: 900 !important; line-height: 1 !important; margin-left: auto !important;">ASSIST</span>
            </a>
        `;
        
        // Find logout or append before it
        const logoutLi = Array.from(sidebar.querySelectorAll("li")).find(item => item.textContent.includes("Logout") || item.querySelector("a[href*='logout']") || item.querySelector("a[href*='index.html']"));
        if (logoutLi && logoutLi.parentElement === sidebar) {
            sidebar.insertBefore(li, logoutLi);
        } else {
            sidebar.appendChild(li);
        }
        
        li.querySelector("a").addEventListener("click", (e) => {
            e.preventDefault();
            const panel = document.getElementById("aiChatPanel");
            const launcher = document.getElementById("aiChatLauncher");
            if (panel) {
                panel.classList.toggle("active");
                if (launcher) launcher.classList.toggle("active", panel.classList.contains("active"));
                const messagesContainer = document.getElementById("aiChatMessages");
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }
        });
    });
}

function initChatbotSystem() {
    const launcher = document.getElementById("aiChatLauncher");
    const panel = document.getElementById("aiChatPanel");
    const closeBtn = document.getElementById("closeAIChatBtn");
    const sendBtn = document.getElementById("aiSendChatBtn");
    const input = document.getElementById("aiChatInput");
    const messagesContainer = document.getElementById("aiChatMessages");
    const voiceBackToggle = document.getElementById("aiVoiceBackToggle");
    const speechRecBtn = document.getElementById("aiSpeechRecBtn");

    let voiceOutputEnabled = false;
    let isSpeechRecognitionActive = false;

    // Toggle Chat Panel visibility
    launcher.addEventListener("click", () => {
        panel.classList.toggle("active");
        launcher.classList.toggle("active");
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    closeBtn.addEventListener("click", () => {
        panel.classList.remove("active");
        launcher.classList.remove("active");
    });

    // Voice Back synthesis toggle
    voiceBackToggle.addEventListener("click", () => {
        voiceOutputEnabled = !voiceOutputEnabled;
        voiceBackToggle.classList.toggle("active", voiceOutputEnabled);
        if (voiceOutputEnabled) {
            speakText("Vocal responses enabled! I will speak answers back to you.");
        } else {
            window.speechSynthesis.cancel();
        }
    });

    // Send Button trigger
    sendBtn.addEventListener("click", () => {
        handleUserInput();
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleUserInput();
        }
    });

    // 3. VOICE SPEECH RECOGNITION (SPEECH TO TEXT INPUT)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-IN'; // Indian English pronunciation friendly!
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        speechRecBtn.addEventListener("click", () => {
            if (isSpeechRecognitionActive) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        recognition.onstart = () => {
            isSpeechRecognitionActive = true;
            speechRecBtn.classList.add("listening");
            input.placeholder = "Listening... Speak your query!";
        };

        recognition.onend = () => {
            isSpeechRecognitionActive = false;
            speechRecBtn.classList.remove("listening");
            input.placeholder = "Type a query...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            handleUserInput(); // Auto submit transcribed query!
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            isSpeechRecognitionActive = false;
            speechRecBtn.classList.remove("listening");
            input.placeholder = "Type a query...";
        };
    } else {
        speechRecBtn.style.opacity = "0.5";
        speechRecBtn.title = "Voice Speech Recognition is not supported on this browser (use Chrome/Safari)";
    }

    /**
     * Parse and handle message submission
     */
    function handleUserInput() {
        const text = input.value.trim();
        if (!text) return;

        // Render User bubble
        appendBubble(text, "user");
        input.value = "";

        // Process Bot NLP matching response
        setTimeout(() => {
            const responseText = matchBotResponse(text);
            appendBubble(responseText, "bot");
            
            // Speak response if enabled
            if (voiceOutputEnabled) {
                // Strip HTML tags for clean vocals
                const cleanText = responseText.replace(/<\/?[^>]+(>|$)/g, "");
                speakText(cleanText);
            }
        }, 600);
    }

    /**
     * Append chat bubble in logs area
     */
    function appendBubble(content, sender) {
        const bubble = document.createElement("div");
        bubble.className = `ai-bubble ${sender}`;
        bubble.innerHTML = content;
        messagesContainer.appendChild(bubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Pre-programmed keyword processor
     */
    function matchBotResponse(query) {
        const lower = query.toLowerCase();

        // 1. Search knowledge base tags
        for (const key in BOT_KNOWLEDGE) {
            const kb = BOT_KNOWLEDGE[key];
            const hasMatch = kb.keywords.some(word => lower.includes(word));
            if (hasMatch) {
                return kb.response;
            }
        }

        // 2. Default fallback AI logic
        return `I am still learning to parse your exact query. For direct help regarding registrations, payments, or placement records, feel free to submit a contact form under our Contact Us dashboard, or ask about our specific premium course syllabus: <b>Web Development, Python, Java, Data Analytics, Placement Training, or Cyber Security</b>!`;
    }

    /**
     * Voice Synthesis Speak engine (Text-to-speech output)
     */
    function speakText(text) {
        if (!window.speechSynthesis) return;

        // Cancel active audio
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0; // standard speaking rate
        utterance.pitch = 1.0;

        // Choose a clear English speaker voice if available
        const voices = window.speechSynthesis.getVoices();
        const idealVoice = voices.find(v => v.lang.includes("en-US") || v.lang.includes("en-GB"));
        if (idealVoice) {
            utterance.voice = idealVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
}
})();
