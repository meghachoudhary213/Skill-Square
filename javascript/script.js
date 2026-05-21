// Scroll To Top Button

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {

    // Show Button

    if(window.scrollY > 300){
        scrollTopBtn.style.display = "block";
    }
    else{
        scrollTopBtn.style.display = "none";
    }

    // Navbar Effect

    const navbar = document.querySelector(".custom-navbar");

    if(window.scrollY > 50){
        navbar.classList.add("scrolled");
    }
    else{
        navbar.classList.remove("scrolled");
    }

});

// Scroll To Top

scrollTopBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

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
// REGISTER SYSTEM

const registerForm =
document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener("submit", function(e){

        e.preventDefault();

        // GET VALUES

        const name =
        document.getElementById("name").value;

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        // SAVE DATA

        localStorage.setItem("userName", name);

        localStorage.setItem("userEmail", email);

        localStorage.setItem("userPassword", password);

        // SUCCESS MESSAGE

        alert("Registration Successful");

        // OPEN DASHBOARD

        window.location.href = "dashboard.html";

    });

}



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
    // 1. Dynamic Session-Aware Navbar Options
    const loginLink = document.querySelector('a[href="login.html"]');
    const registerLink = document.querySelector('a[href="register.html"]');
    
    const studentToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    
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
    } else if (adminToken && loginLink && registerLink) {
        // Admin is logged in
        loginLink.href = "admin-dashboard.html";
        loginLink.textContent = "Admin Panel";
        loginLink.classList.add("nav-link-dashboard");
        
        registerLink.href = "#";
        registerLink.textContent = "Logout";
        registerLink.classList.add("nav-link-logout");
        registerLink.addEventListener("click", (e) => {
            e.preventDefault();
            // Clear admin session
            localStorage.removeItem("adminToken");
            alert("Logged out successfully!");
            window.location.reload();
        });
    }
    
    // 2. Auto-Collapse Mobile Navbar on Link Selection
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                // If collapsed menu is open, toggle it closed
                if (navbarCollapse.classList.contains("show")) {
                    try {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        } else {
                            new bootstrap.Collapse(navbarCollapse).hide();
                        }
                    } catch (err) {
                        // Fallback manual class toggle if Bootstrap object is unavailable
                        navbarCollapse.classList.remove("show");
                    }
                }
            });
        });
    }
});