const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  joinWaitingList,
  leaveWaitingList,
} = require("../controllers/borrowingController");

// ── Waiting List ──────────────────────────────────────────────────────────────
router.post("/", protect, joinWaitingList);
router.delete("/:bookId", protect, leaveWaitingList);

module.exports = router;
