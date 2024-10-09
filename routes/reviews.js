const express = require("express");
const { postReviews, getReviews } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", postReviews);


module.exports = router;