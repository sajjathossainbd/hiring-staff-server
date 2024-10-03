// routes/userRoutes.js

const express = require("express");
const { addUser, getAllUsers, getCurrentUser, updateUserProfile, deleteUser, updateUserRole } = require("../controllers/userController");

const router = express.Router();

router.post("/", addUser);
router.get("/", getAllUsers);
router.get("/current/:email", getCurrentUser);
router.patch("/profile/:email", updateUserProfile);
router.delete("/:id", deleteUser);
router.patch("/profile/role/:id", updateUserRole);

module.exports = router;
