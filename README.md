# 🎓 Skill Square – Premium Learning Platform (MERN Stack)

Welcome to **Skill Square**, a state-of-the-art educational learning platform built using the MERN stack. Designed with a luxury **black-and-gold aesthetic**, the platform features smooth transitions, rich cards, fully responsive layouts, and robust backend database integration. 

It provides an end-to-end user experience for students looking to enroll in premium courses and administrators seeking real-time system management.

---

## ✨ Features

### 👨‍🎓 Student Portal
* **Dynamic Registrations & Login**: Custom secure registration saving students' contact data (including name, email, phone, and location) with dynamic password hashing.
* **Auth-Guarded Dashboard**: Full session checks using client-side auth-guards, personalized welcoming headers, course trackers, and progress bars.
* **Course Catalog**: Premium interfaces displaying detailed syllabus layouts for Web Development, Python, Data Analytics, Java, and Cyber Security.
* **Integrated Contact Form**: Direct communication portal where students can submit queries, which are processed and saved in real-time to the database.
* **Interactive Certificate Panel**: Elegant screens highlighting earned certificates with options to download and a responsive header back-navigation link.

### 👑 Admin Console (Management Panel)
* **Secure Admin Entry**: Access-restricted administrative portal secured by default credentials (`admin@skillsquare.com` / `admin123`) using JSON Web Tokens (JWT).
* **Live System Metrics**: Dynamic database counter showing the total number of registered students, connected system status, and system parameters.
* **Student Directory & CRUD Controls**: Sleek dark table layout showcasing names, email IDs, contact numbers, cities/locations, and registration timestamps.
* **Real-time Deletion**: Admin capability to permanently delete students from MongoDB on a single click with smooth fade-out CSS animations.

---

## 🛠️ Tech Stack

* **Frontend**: HTML5 (Semantic Structure), CSS3 (Vanilla design, custom gradients, glassmorphism animations), JavaScript (ES6+ Asynchronous fetch APIs), Bootstrap 5, FontAwesome Icons.
* **Backend**: Node.js, Express.js (REST API Router Architecture).
* **Database**: MongoDB Atlas cloud cluster, managed via Mongoose ODM.
* **Security & Auth**: JSON Web Tokens (JWT), BcryptJS password encryption, CORS enablement.

---

## 💻 Local Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Configure Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install all required packages:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` folder and add your connection variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
   JWT_SECRET=skillsquare_secret_key_123
   ```
4. Start the local server:
   ```bash
   node server.js
   ```
   *The console should print `Server Running On 5000` and `MongoDB Connected`.*

### 3. Open Frontend
1. Open the project root folder.
2. Double-click `index.html` to run the landing page in your web browser.
3. Access `admin-login.html` to enter the administrator system.

---

## 🚀 Free Cloud Deployment

This platform is configured with a **Zero-Config URL Auto-Handler**. When hosting, it dynamically switches from `localhost` to your production API, making cloud hosting seamless:

* **Backend Hosting**: [Render.com](https://render.com) (Root directory set to `backend`, start command `node server.js`).
* **Frontend Hosting**: [Netlify.com](https://netlify.com) or [Vercel.com](https://vercel.com) (Deploys static root HTML/CSS/JS files).
* **Database Hosting**: [MongoDB Atlas](https://cloud.mongodb.com) (Ensure IP `0.0.0.0/0` is added under Network Access).

---

## 🔒 Default System Credentials

* **Admin Username**: `admin@skillsquare.com`
* **Admin Password**: `admin123`
