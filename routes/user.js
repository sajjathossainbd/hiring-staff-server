// routes/userRoutes.js

const express = require("express");
const {
  // addUser,
  // getAllUsers,
  getCurrentUser,
  updateUserProfile,
  deleteUser,
  updateUserRole,
  candidatesEmail,
} = require("../controllers/userController");
const { getAllCandidates, addCandidate } = require("../controllers/candidateController");
const { getAllRecruiters, deleteRecruiters } = require("../controllers/recruitersController");

const router = express.Router();

router.post("/candidates", addCandidate);
// router.get("/", getAllUsers);
router.get("/candidates", getAllCandidates);
router.get("/recruiters", getAllRecruiters);
router.get("/current/:email", getCurrentUser);
router.patch("/profile/:email", updateUserProfile);
router.delete("/recruiter/:id", deleteRecruiters);
router.patch("/profile/role/:id", updateUserRole);

// get emails for email
router.get("/candidate-emails", candidatesEmail);

module.exports = router;
