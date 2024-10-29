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
const reviewsRoute = require("./routes/reviews");

// const jwtRoute = require("./utils/jwtUtils");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ["https://hiring-staff.vercel.app", "http://localhost:5173"],
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
// Connect to MongoDB
connectDB();

// Define routes

app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "6hr" })
  res.send({ token: token });
})

// User
// app.use("/jwt", jwtRoute);

// User
app.use("/users", userRoutes);

// Jobs
app.use("/jobs", jobsRoutes);

// Candidates
app.use("/candidates", candidateRoutes);

// recruiters
app.use("/recruiters", recruiterRoutes);

// Blogs
app.use("/blogs", blogsRoutes);

// Payment
app.use("/create-payment-intent", paymentRoutes);
app.use("/payment-history", paymentHistory);

// Reviews
app.use("/reviews", reviewsRoute);


// Default route for server status
app.get("/", (req, res) => {
  res.send("Hiring Staff Server Is Running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port is ${port}`);
});
