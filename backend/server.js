const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

// Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use(cors());

app.use(express.json());

// Import Routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");
const enrollmentRoutes = require("./routes/enrollment");

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/enrollment", enrollmentRoutes);



// MongoDB Connect

mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("MongoDB Connected");

})

.catch((err) => {

    console.log(err);

});



// Test Route

app.get("/", (req, res) => {

    res.send("Backend Running");

});



const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {

    console.log(`Server Running On ${PORT}`);

});