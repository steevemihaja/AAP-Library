const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  joinWaitingList,
  leaveWaitingList,
  getMyWaitingList,
  getWaitingListByBook
} = require("../controllers/waitingListController");

router.post("/", protect, joinWaitingList);
router.delete("/:id", protect, leaveWaitingList);
router.get("/my-list", protect, getMyWaitingList);
router.get("/book/:bookId", protect, authorize("admin", "librarian"), getWaitingListByBook);

module.exports = router;