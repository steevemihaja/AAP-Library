const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} = require("../controllers/reviewController");

router.route("/").post(protect, createReview);

router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

router.post("/:id/helpful", protect, markHelpful);

module.exports = router;
