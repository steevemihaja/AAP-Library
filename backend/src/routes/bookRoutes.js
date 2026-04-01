const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { validate, bookValidation } = require("../middleware/validation");
const upload = require("../config/upload");
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  uploadCover,
  getGenres,
} = require("../controllers/bookController");

// Define specific routes first
router.get("/genres", getGenres);

router
  .route("/")
  .get(getBooks)
  .post(
    protect,
    authorize("librarian", "admin"),
    validate(bookValidation.create),
    createBook,
  );

router
  .route("/:id")
  .get(getBook)
  .put(protect, authorize("librarian", "admin"), updateBook)
  .delete(protect, authorize("admin"), deleteBook);

router.post(
  "/:id/cover",
  protect,
  authorize("librarian", "admin"),
  upload.single("cover"),
  uploadCover,
);

module.exports = router;
