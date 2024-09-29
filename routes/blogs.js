import { getAllBlogs } from "../controllers/blogsController";

const express = require("express");
const router = express.Router();

// GET all blogs
router.get("/", getAllBlogs);

module.exports = router;

