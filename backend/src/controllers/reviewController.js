const Review = require("../models/Review");
const Book = require("../models/Book");
const Borrowing = require("../models/Borrowing"); // ← MANQUAIT

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { bookId, rating, title, content, tags } = req.body;

    // Check if user has borrowed this book
    const hasBorrowed = await Borrowing.findOne({
      user: req.user.id,
      book: bookId,
      status: "returned",
    });

    if (!hasBorrowed && req.user.role === "user") {
      return res.status(400).json({
        success: false,
        error: "You can only review books you have borrowed",
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      user: req.user.id,
      book: bookId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this book",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      book: bookId,
      rating,
      title,
      content,
      tags: tags || [],
      status: req.user.role === "admin" ? "approved" : "pending",
    });

    // Update book's reviews and average rating
    const book = await Book.findById(bookId);
    book.reviews.push(review._id);

    // Calculate new average rating (only approved)
    const allReviews = await Review.find({ book: bookId, status: "approved" });
    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          allReviews.length
        : 0;
    book.averageRating = avgRating;
    book.totalReviews = allReviews.length;

    await book.save();

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review from a borrowing
// @route   POST /api/borrowings/:id/review
// @access  Private
const createReviewFromBorrowing = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);

    if (!borrowing) {
      return res
        .status(404)
        .json({ success: false, error: "Borrowing not found" });
    }

    // Must be owner
    if (borrowing.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // Must be returned
    if (borrowing.status !== "returned") {
      return res.status(400).json({
        success: false,
        error: "You can only review books you have returned",
      });
    }

    const { rating, title, content, tags } = req.body;
    const bookId = borrowing.book;

    // Check duplicate
    const existingReview = await Review.findOne({
      user: req.user.id,
      book: bookId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "Vous avez déjà soumis un avis pour ce livre",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      book: bookId,
      rating,
      title,
      content,
      tags: tags || [],
      status: "pending",
    });

    // Update book stats
    const book = await Book.findById(bookId);
    if (book) {
      book.reviews.push(review._id);
      const allReviews = await Review.find({
        book: bookId,
        status: "approved",
      });
      book.averageRating =
        allReviews.length > 0
          ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) /
            allReviews.length
          : 0;
      book.totalReviews = allReviews.length;
      await book.save();
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this review",
      });
    }

    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.title) review.title = req.body.title;
    if (req.body.content) review.content = req.body.content;

    if (req.user.role !== "admin") {
      review.status = "pending";
    }

    await review.save();

    const book = await Book.findById(review.book);
    const allReviews = await Review.find({
      book: review.book,
      status: "approved",
    });
    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          allReviews.length
        : 0;
    book.averageRating = avgRating;
    await book.save();

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this review",
      });
    }

    await review.deleteOne(); // ← .remove() est déprécié

    const book = await Book.findById(review.book);
    book.reviews.pull(review._id);

    const allReviews = await Review.find({
      book: review.book,
      status: "approved",
    });
    book.averageRating =
      allReviews.length > 0
        ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          allReviews.length
        : 0;
    book.totalReviews = allReviews.length;
    await book.save();

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    review.helpful += 1;
    await review.save();

    res.json({ success: true, helpful: review.helpful });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/book/:bookId
// @access  Public
const getBookReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      book: req.params.bookId,
      status: "approved",
    })
      .populate("user", "firstName lastName profilePicture")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  createReviewFromBorrowing,
  updateReview,
  deleteReview,
  markHelpful,
  getBookReviews,
};
