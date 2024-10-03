const express = require("express");
const { getAllBlogs, getBlogById } = require("../controllers/blogsController");

const router = express.Router();

// GET all blogs
router.get("/", getAllBlogs);

// GET/candidate by id
router.get("/:id", getBlogById);

module.exports = router;
