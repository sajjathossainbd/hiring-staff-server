const express = require("express");
const { getAllBlogs, getBlogById, searchAndFilterBlogs } = require("../controllers/blogsController");

const router = express.Router();

// GET all blogs
router.get("/", getAllBlogs);

// GET/candidate by id
router.get("/:id", getBlogById);

//GET/search and filter blogs by title and/or tags
router.get("/search", searchAndFilterBlogs);

module.exports = router;
