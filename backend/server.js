const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const app = express();



app.use(cors());

app.use(express.json());

// Import Routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);



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