const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  borrowBook,
  getMyBorrowings,
  returnBook,
  renewBorrowing,
  updateNote,
  getMyWaitingList,
} = require("../controllers/borrowingController");

const {
  createReviewFromBorrowing,
} = require("../controllers/reviewController");

// ── Emprunts ─────────────────────────────────────────────────────────────────
router.post("/", protect, borrowBook);
router.get("/my-borrowings", protect, getMyBorrowings);
router.put("/:id/return", protect, returnBook);
router.put("/:id/renew", protect, renewBorrowing);
router.put("/:id/note", protect, updateNote);
router.post("/:id/review", protect, createReviewFromBorrowing);

// ── Liste d'attente ───────────────────────────────────────────────────────────
router.get("/waitinglist/my-list", protect, getMyWaitingList);

module.exports = router;
