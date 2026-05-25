// Skill Square Dashboard Active Enrollments Handler
const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://skill-square-backend-megha.onrender.com/api";

const COURSE_ICONS = {
    "webdevelopment": "fa-solid fa-code",
    "python": "fa-brands fa-python",
    "dataanalytics": "fa-solid fa-chart-line",
    "java": "fa-brands fa-java",
    "placement": "fa-solid fa-user-tie",
    "cyber": "fa-solid fa-shield-halved"
};

const COURSE_TRAINERS = {
    "webdevelopment": "Aman Singh",
    "python": "Aman Singh",
    "dataanalytics": "Aman Singh",
    "java": "Aman Singh",
    "placement": "Aman Singh",
    "cyber": "Aman Singh"
};

const COURSE_DURATIONS = {
    "webdevelopment": "6 Months",
    "python": "4 Months",
    "dataanalytics": "5 Months",
    "java": "5 Months",
    "placement": "3 Months",
    "cyber": "6 Months"
};

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    loadStudentEnrollments(token);
});

/**
 * Load active course enrollments dynamically
 */
async function loadStudentEnrollments(token) {
    const container = document.getElementById("enrolledCoursesContainer");
    const countEl = document.getElementById("enrolledCoursesCount");
    const section = document.getElementById("enrolledCoursesSection");

    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/enrollment/my-courses`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (data.success) {
            const enrollments = data.enrollments || [];
            
            // Show section
            section.style.display = "block";

            // Update statistical card
            if (countEl) {
                countEl.textContent = enrollments.length;
            }

            if (enrollments.length === 0) {
                // Render gorgeous empty state CTA
                container.innerHTML = `
                    <div class="col-12">
                        <div class="empty-enrollment-box">
                            <i class="fa-solid fa-book-open"></i>
                            <h3>No Active Enrollments</h3>
                            <p>
                                You are not enrolled in any of our premium courses yet.<br>
                                Boost your practical skillset with industry-expert guided coaching today.
                            </p>
                            <a href="courses.html">
                                <button class="empty-enrollment-btn">
                                    Explore Courses
                                </button>
                            </a>
                        </div>
                    </div>
                `;
                return;
            }

            // Render enrolled courses grid
            container.innerHTML = "";
            enrollments.forEach((enroll, index) => {
                const iconClass = COURSE_ICONS[enroll.courseId] || "fa-solid fa-graduation-cap";
                const trainer = COURSE_TRAINERS[enroll.courseId] || "Aman Singh";
                const duration = COURSE_DURATIONS[enroll.courseId] || "5 Months";

                // Format Enrollment Date
                const enrolledDate = enroll.enrolledAt 
                    ? new Date(enroll.enrolledAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })
                    : "Active";

                // Mock unique progress values for visual fidelity
                const mockProgresses = [25, 45, 10, 60, 30];
                const progressVal = mockProgresses[index % mockProgresses.length];

                const cardCol = document.createElement("div");
                cardCol.className = "col-lg-4 col-md-6";
                cardCol.innerHTML = `
                    <div class="student-course-card">
                        <div>
                            <div class="student-course-card-top">
                                <i class="${iconClass}"></i>
                                <h3>${enroll.courseName}</h3>
                            </div>
                            
                            <div class="student-course-details">
                                <div>
                                    <i class="fa-solid fa-user"></i>
                                    <span>Trainer: <strong>${trainer}</strong></span>
                                </div>
                                <div>
                                    <i class="fa-solid fa-clock"></i>
                                    <span>Duration: <strong>${duration}</strong></span>
                                </div>
                                <div>
                                    <i class="fa-solid fa-calendar-check"></i>
                                    <span>Joined: <strong>${enrolledDate}</strong></span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <!-- Custom Luxury Progress Bar -->
                            <div class="luxury-progress-widget">
                                <div class="luxury-progress-widget-header">
                                    <span>Course Progress</span>
                                    <strong>${progressVal}%</strong>
                                </div>
                                <div class="luxury-progress-bar-track">
                                    <div class="luxury-progress-bar-fill" style="width: ${progressVal}%"></div>
                                </div>
                            </div>

                            <button class="resume-learning-btn" onclick="alert('Opening Course Material / Live Portal...\\n\\nWelcome to your learning page for ${enroll.courseName}! Ready to build some amazing projects?')">
                                <i class="fa-solid fa-circle-play"></i> Resume Learning
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(cardCol);
            });
        }
    } catch (error) {
        console.error("Dashboard Load Active Courses Error:", error);
    }
}
