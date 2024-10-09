const express = require("express");
const { getBlogById, searchAndFilterBlogs } = require("../controllers/blogsController");

const router = express.Router();

// GET/candidate by id
router.get("/:id", getBlogById);


// GET all blogs with pagination and search/filter
router.get("/", searchAndFilterBlogs);

module.exports = router;
