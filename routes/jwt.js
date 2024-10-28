const express = require("express");
const { postJwt } = require("../utils/jwtUtils");

const router = express.Router();

// POST /auth/jwt - Generate a JWT
router.post("/", postJwt);

module.exports = router;
