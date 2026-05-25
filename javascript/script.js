// Override native window.alert with premium toast notification
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

// Scroll To Top Button
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        // Show Button
        if(window.scrollY > 300){
            scrollTopBtn.style.display = "block";
        }
        else{
            scrollTopBtn.style.display = "none";
        }
    });

    // Scroll To Top
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// Navbar Effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".custom-navbar");
    if (navbar) {
        if(window.scrollY > 50){
            navbar.classList.add("scrolled");
        }
        else{
            navbar.classList.remove("scrolled");
        }
    }
});
// // Dark Light Mode

// const themeToggle = document.getElementById("themeToggle");

// themeToggle.addEventListener("click", () => {

//     document.body.classList.toggle("light-mode");

//     // Icon Change

//     if(document.body.classList.contains("light-mode")){

//         themeToggle.innerHTML =
//         '<i class="fa-solid fa-sun"></i>';

//     }
//     else{

//         themeToggle.innerHTML =
//         '<i class="fa-solid fa-moon"></i>';

//     }

// });
// Dashboard Menu
function showSection(sectionId){

    const sections =
    document.querySelectorAll(".content-section");

    sections.forEach((section)=>{

        section.classList.remove("active-section");

    });

    document
    .getElementById(sectionId)
    .classList.add("active-section");

}
// REGISTER SYSTEM (Intercepted and handled dynamically by register.js)



// SHOW PROFILE DATA

const showName =
document.getElementById("showName");

const showEmail =
document.getElementById("showEmail");

if(showName && showEmail){

    showName.innerHTML =
    localStorage.getItem("userName");

    showEmail.innerHTML =
    localStorage.getItem("userEmail");

}

// ==========================================
// SESSION-AWARE NAVIGATION & MOBILE AUTO-COLLAPSE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Dynamic Greeting in Mobile Top Header
    const userGreet = document.querySelector(".mobile-user-greet");
    if (userGreet) {
        const userName = localStorage.getItem("userName");
        if (userName) {
            userGreet.textContent = `Hi, ${userName.split(' ')[0]}! 👋`;
        }
    }

    // 1. Dynamic Session-Aware Navbar Options
    const loginLink = document.querySelector('a[href="login.html"]');
    const registerLink = document.querySelector('a[href="register.html"]');
    
    const studentToken = localStorage.getItem("token");
    
    if (studentToken && loginLink && registerLink) {
        // Student is logged in
        loginLink.href = "dashboard.html";
        loginLink.textContent = "Dashboard";
        loginLink.classList.add("nav-link-dashboard");
        
        registerLink.href = "#";
        registerLink.textContent = "Logout";
        registerLink.classList.add("nav-link-logout");
        registerLink.addEventListener("click", (e) => {
            e.preventDefault();
            // Clear student session
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userPhone");
            localStorage.removeItem("userLocation");
            alert("Logged out successfully!");
            window.location.reload();
        });
    }
    
    // 2. Native Bootstrap 5 Auto-Collapse Mobile Navbar on Link Selection
    const navbarCollapse = document.getElementById("navbarNav");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    
    if (navbarCollapse && navLinks) {
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (navbarCollapse.classList.contains("show")) {
                    try {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    } catch (err) {
                        navbarCollapse.classList.remove("show");
                    }
                }
            });
        });
    }

    // Initialize the Faculty Social Links Editor System
    initFacultyEditableSocials();
});

/**
 * Premium Faculty Editable Social Links System
 * Dynamically handles absolute-positioned edit buttons, parses pre-existing hardcoded URLs
 * on initial load, mounts a beautiful glassmorphic modal form, and saves URLs to localStorage.
 */
function initFacultyEditableSocials() {
    const facultyCards = document.querySelectorAll('.faculty-card');
    if (facultyCards.length === 0) return;

    // 1. Dynamically create and mount the glassmorphic modal HTML if not already in the DOM
    let modal = document.getElementById('facultySocialsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'facultySocialsModal';
        modal.className = 'faculty-modal-overlay';
        modal.innerHTML = `
            <div class="faculty-modal-content">
                <div class="faculty-modal-header">
                    <h3 id="modalFacultyName">Edit Social Links</h3>
                    <button class="faculty-modal-close" id="closeFacultyModal">&times;</button>
                </div>
                <div class="faculty-modal-body">
                    <form id="facultySocialsForm" autocomplete="off" onsubmit="event.preventDefault();">
                        <input type="hidden" id="editFacultyName">
                        
                        <label for="facFacebook">Facebook URL</label>
                        <div class="input-wrapper">
                            <i class="fa-brands fa-facebook-f input-icon"></i>
                            <input type="url" id="facFacebook" placeholder="https://facebook.com/username">
                        </div>
                        
                        <label for="facLinkedin">LinkedIn URL</label>
                        <div class="input-wrapper">
                            <i class="fa-brands fa-linkedin-in input-icon"></i>
                            <input type="url" id="facLinkedin" placeholder="https://linkedin.com/in/username">
                        </div>
                        
                        <label for="facGithub">GitHub URL</label>
                        <div class="input-wrapper">
                            <i class="fa-brands fa-github input-icon"></i>
                            <input type="url" id="facGithub" placeholder="https://github.com/username">
                        </div>
                        
                        <label for="facInstagram">Instagram URL</label>
                        <div class="input-wrapper">
                            <i class="fa-brands fa-instagram input-icon"></i>
                            <input type="url" id="facInstagram" placeholder="https://instagram.com/username">
                        </div>
                    </form>
                </div>
                <div class="faculty-modal-footer">
                    <button class="faculty-modal-btn faculty-modal-btn-cancel" id="cancelFacultyModal">Cancel</button>
                    <button class="faculty-modal-btn faculty-modal-btn-save" id="saveFacultyModal">Save Links</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add modal close and action event listeners
        const closeModal = () => {
            modal.classList.remove('active');
        };

        document.getElementById('closeFacultyModal').addEventListener('click', closeModal);
        document.getElementById('cancelFacultyModal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.getElementById('saveFacultyModal').addEventListener('click', () => {
            const facultyName = document.getElementById('editFacultyName').value;
            const facebook = document.getElementById('facFacebook').value.trim();
            const linkedin = document.getElementById('facLinkedin').value.trim();
            const github = document.getElementById('facGithub').value.trim();
            const instagram = document.getElementById('facInstagram').value.trim();

            const socials = { facebook, linkedin, github, instagram };
            localStorage.setItem(`faculty_socials_${facultyName}`, JSON.stringify(socials));
            
            closeModal();
            // Instantly apply changes across all cards by refreshing the page
            window.location.reload();
        });
    }

    // 2. Setup each faculty card dynamically
    facultyCards.forEach(card => {
        const nameEl = card.querySelector('h3');
        if (!nameEl) return;
        const facultyName = nameEl.textContent.trim();

        // Force relative positioning (fallback in case CSS is slow)
        card.style.position = 'relative';

        // Retrieve saved social links or load from existing DOM icons if first time
        let socials = localStorage.getItem(`faculty_socials_${facultyName}`);
        if (!socials) {
            // Parse existing DOM links to cache initial setup
            const initialSocials = { facebook: '', linkedin: '', github: '', instagram: '' };
            const anchors = card.querySelectorAll('.faculty-icons a');
            anchors.forEach(anchor => {
                const href = anchor.getAttribute('href');
                if (href && href !== '#') {
                    const icon = anchor.querySelector('i');
                    if (icon) {
                        const classList = icon.className.toLowerCase();
                        if (classList.includes('facebook')) {
                            initialSocials.facebook = href;
                        } else if (classList.includes('linkedin')) {
                            initialSocials.linkedin = href;
                        } else if (classList.includes('instagram')) {
                            initialSocials.instagram = href;
                        } else if (classList.includes('github')) {
                            initialSocials.github = href;
                        }
                    }
                }
            });
            socials = initialSocials;
            localStorage.setItem(`faculty_socials_${facultyName}`, JSON.stringify(socials));
        } else {
            socials = JSON.parse(socials);
        }

        // Apply socials to the card icons dynamically
        const iconsContainer = card.querySelector('.faculty-icons');
        if (iconsContainer) {
            iconsContainer.innerHTML = '';
            
            let hasAnyLink = false;
            const linkMap = [
                { key: 'facebook', icon: 'fa-brands fa-facebook-f' },
                { key: 'linkedin', icon: 'fa-brands fa-linkedin-in' },
                { key: 'github', icon: 'fa-brands fa-github' },
                { key: 'instagram', icon: 'fa-brands fa-instagram' }
            ];

            linkMap.forEach(item => {
                const url = socials[item.key];
                if (url && url !== '#' && url !== '') {
                    iconsContainer.innerHTML += `<a href="${url}" target="_blank"><i class="${item.icon}"></i></a>`;
                    hasAnyLink = true;
                }
            });

            // If no URLs are active, display all 4 as standard placeholders
            if (!hasAnyLink) {
                iconsContainer.innerHTML = `
                    <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
                    <a href="#"><i class="fa-brands fa-github"></i></a>
                    <a href="#"><i class="fa-brands fa-instagram"></i></a>
                `;
            }
        }

        // Create and append the gold edit pencil button to the top-right of the card
        let editBtn = card.querySelector('.edit-faculty-btn');
        if (!editBtn) {
            editBtn = document.createElement('div');
            editBtn.className = 'edit-faculty-btn';
            editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
            editBtn.title = `Edit ${facultyName}'s Social Links`;
            card.appendChild(editBtn);
        }

        // Event listener for opening the modal
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Populate the modal fields
            document.getElementById('modalFacultyName').textContent = `Edit Links: ${facultyName}`;
            document.getElementById('editFacultyName').value = facultyName;
            
            const currentSocials = JSON.parse(localStorage.getItem(`faculty_socials_${facultyName}`)) || {};
            document.getElementById('facFacebook').value = currentSocials.facebook || '';
            document.getElementById('facLinkedin').value = currentSocials.linkedin || '';
            document.getElementById('facGithub').value = currentSocials.github || '';
            document.getElementById('facInstagram').value = currentSocials.instagram || '';

            // Show the modal
            modal.classList.add('active');
        });
    });
}

// Load AI Chatbot automatically on all pages
(function() {
    if (document.getElementById("aiChatLauncher")) return;
    const script = document.createElement("script");
    script.src = "javascript/chatbot.js?v=" + new Date().getTime();
    document.body.appendChild(script);
})();