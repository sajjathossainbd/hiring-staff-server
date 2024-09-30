const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
require("dotenv").config();

// Import route files
const userRoutes = require("./routes/user");
const jobsRoutes = require("./routes/jobs");
const candidateRoutes = require("./routes/candidates");
const recruiterRoutes = require("./routes/recruiters");
const paymentRoutes = require("./routes/payment");
const blogsRoutes = require("./routes/blogs");
const paymentHistory = require("./routes/paymentHistory");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Define routes
app.use("/users", userRoutes);
app.use("/jobs", jobsRoutes);
app.use("/jobs/:id", jobsRoutes);
app.use("/candidates", candidateRoutes);
app.use("/recruiters", recruiterRoutes);
app.use("/create-payment-intent", paymentRoutes);
app.use("/blogs", blogsRoutes);
app.use("/payment-history", paymentHistory);

// Default route for server status

app.get("/", (req, res) => {
  res.send("Hiring Staff Server Is Running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
