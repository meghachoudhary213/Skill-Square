// Client-Side Full-Stack API Integration for Skill Square
const API_BASE_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  // === 1. REGISTRATION ===
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.removeAttribute("action"); // Ensure standard form submission is intercepted
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword") ? document.getElementById("confirmPassword").value : "";

      if (!name || !email || !password) {
        alert("Please enter all fields.");
        return;
      }

      if (confirmPassword && password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (data.success) {
          alert("Registration Successful! Please login.");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("Could not connect to the backend server. Make sure your server is running.");
      }
    });
  }

  // === 2. LOGIN ===
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || "Invalid credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Could not connect to the backend server. Make sure your server is running.");
      }
    });
  }

  // === 3. DASHBOARD (GUARD & DYNAMIC DATA) ===
  const isDashboard = window.location.pathname.includes("dashboard.html");
  if (isDashboard) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to access the dashboard.");
      window.location.href = "login.html";
      return;
    }

    // Load User Profile dynamically
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          const user = data.user;
          
          // Update dashboard welcome greeting
          const welcomeHeading = document.querySelector(".top-bar h1");
          if (welcomeHeading) {
            welcomeHeading.innerHTML = `Welcome Back, ${user.name} 👋`;
          }

          // Update dynamic profile fields if visible
          const showName = document.getElementById("showName");
          const showEmail = document.getElementById("showEmail");
          if (showName) showName.textContent = user.name;
          if (showEmail) showEmail.textContent = user.email;
        } else {
          // Token is invalid/expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "login.html";
        }
      } catch (error) {
        console.error("Profile load error:", error);
        // Fallback to local storage values if offline
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (localUser.name) {
          const welcomeHeading = document.querySelector(".top-bar h1");
          if (welcomeHeading) welcomeHeading.innerHTML = `Welcome Back, ${localUser.name} 👋`;
          const showName = document.getElementById("showName");
          const showEmail = document.getElementById("showEmail");
          if (showName) showName.textContent = localUser.name;
          if (showEmail) showEmail.textContent = localUser.email;
        }
      }
    };

    loadProfile();

    // Handle Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Logged out successfully.");
        window.location.href = "index.html";
      });
    }
  }

  // === 4. CONTACT FORM ===
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
        const response = await fetch(`${API_BASE_URL}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await response.json();

        if (data.success) {
          alert(data.message || "Thank you! Your message has been received.");
          contactForm.reset();
        } else {
          alert(data.message || "Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error("Contact submission error:", error);
        alert("Could not connect to the backend server. Make sure your server is running.");
      }
    });
  }
});
