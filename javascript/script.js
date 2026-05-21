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
// REGISTER FORM

const registerForm =
document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener("submit", function(e){

        e.preventDefault();

        // INPUT VALUES

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

        // REDIRECT

        window.location.href = "./dashboard.html";

    });

}