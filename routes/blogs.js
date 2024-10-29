const express = require("express");
const { getBlogById, searchAndFilterBlogs, getAllBlogs, deleteBlog ,createBlog,} = require("../controllers/blogsController");

const router = express.Router();

// POST a new blog
router.post("/", createBlog); // Route to create a new blog

// GET/candidate by id
router.get("/:id", getBlogById);

// GET all blogs
router.get("/", getAllBlogs);

// GET all blogs with pagination and search/filter
router.get("/", searchAndFilterBlogs);

// Delete blog
router.delete("/delete/:id", deleteBlog);

module.exports = router;
