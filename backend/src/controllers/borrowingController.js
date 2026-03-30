const Borrowing = require("../models/Borrowing");
const Book = require("../models/Book");
const User = require("../models/User");
const WaitingList = require("../models/WaitingList");
const moment = require("moment");

// @desc    Borrow a book
// @route   POST /api/borrowings
// @access  Private
const borrowBook = async (req, res, next) => {
  try {
    const { bookId, dueDate } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Book is not available for borrowing" });
    }

    const existingBorrowing = await Borrowing.findOne({
      user: userId,
      book: bookId,
      status: { $in: ["active", "overdue"] },
    });

    if (existingBorrowing) {
      return res
        .status(400)
        .json({ success: false, error: "You already have this book borrowed" });
    }

    const activeBorrowings = await Borrowing.countDocuments({
      user: userId,
      status: { $in: ["active", "overdue"] },
    });

    if (activeBorrowings >= 5) {
      return res.status(400).json({
        success: false,
        error: "You have reached the maximum borrowing limit (5 books)",
      });
    }

    const borrowing = await Borrowing.create({
      user: userId,
      book: bookId,
      dueDate: dueDate || moment().add(14, "days").toDate(),
    });

    book.availableCopies -= 1;
    book.borrowings.push(borrowing._id);
    await book.save();

    await User.findByIdAndUpdate(userId, {
      $push: { borrowedBooks: borrowing._id },
    });

    await WaitingList.findOneAndDelete({
      user: userId,
      book: bookId,
      status: "waiting",
    });

    res.status(201).json({ success: true, data: borrowing });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get my borrowings
// @route   GET /api/borrowings/my-borrowings
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMyBorrowings = async (req, res, next) => {
  try {
    const borrowings = await Borrowing.find({ user: req.user.id })
      .populate("book", "title author coverImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: borrowings });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Return a book  ← CORRIGÉ : calcul + sauvegarde pénalité en MongoDB
// @route   PUT /api/borrowings/:id/return
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const returnBook = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);

    if (!borrowing) {
      return res
        .status(404)
        .json({ success: false, error: "Borrowing not found" });
    }

    // Seul le propriétaire ou un admin peut retourner
    if (
      borrowing.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    if (borrowing.status === "returned") {
      return res
        .status(400)
        .json({ success: false, error: "Book already returned" });
    }

    // Date de retour : celle fournie ou maintenant
    const returnDate = req.body.returnDate
      ? new Date(req.body.returnDate)
      : new Date();

    // ── Calcul de la pénalité ──────────────────────────────────────────────
    const dueDate = new Date(borrowing.dueDate);
    let penaltyAmount = 0;

    if (returnDate > dueDate) {
      const daysOverdue = Math.ceil(
        (returnDate - dueDate) / (1000 * 60 * 60 * 24),
      );
      penaltyAmount = daysOverdue * 1; // 1€ par jour
    }

    // ── Mise à jour du document ────────────────────────────────────────────
    borrowing.status = "returned";
    borrowing.returnDate = returnDate;
    borrowing.condition = req.body.condition || "good";
    borrowing.penalty = {
      amount: penaltyAmount,
      paid: false,
      paidDate: null,
    };

    await borrowing.save();

    // Remettre le livre disponible si besoin
    await Book.findByIdAndUpdate(borrowing.book, {
      $inc: { availableCopies: 1 },
    });

    res.json({
      success: true,
      data: borrowing,
      penalty: {
        amount: penaltyAmount,
        paid: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Renew a borrowing
// @route   PUT /api/borrowings/:id/renew
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const renewBorrowing = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);

    if (!borrowing) {
      return res
        .status(404)
        .json({ success: false, error: "Borrowing not found" });
    }

    if (
      borrowing.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    if (borrowing.status === "returned") {
      return res
        .status(400)
        .json({ success: false, error: "Cannot renew a returned book" });
    }

    if (borrowing.renewalCount >= 2) {
      return res.status(400).json({
        success: false,
        error: "Maximum renewals reached (2)",
      });
    }

    if (borrowing.status === "overdue") {
      return res.status(400).json({
        success: false,
        error: "Cannot renew an overdue book",
      });
    }

    // Prolonger de 14 jours
    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);

    borrowing.dueDate = newDueDate;
    borrowing.renewalCount += 1;
    borrowing.renewedAt.push(new Date());

    await borrowing.save();

    res.json({ success: true, data: borrowing });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Add/update personal note on a borrowing  ← NOUVELLE ROUTE
// @route   PUT /api/borrowings/:id/note
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updateNote = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);

    if (!borrowing) {
      return res
        .status(404)
        .json({ success: false, error: "Borrowing not found" });
    }

    if (borrowing.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    borrowing.notes = req.body.notes || "";
    await borrowing.save();

    res.json({ success: true, data: borrowing });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get my waiting list
// @route   GET /api/borrowings/waitinglist/my-list
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMyWaitingList = async (req, res, next) => {
  try {
    // Adapter selon votre modèle WaitingList si différent
    // Exemple générique :
    const WaitingList = require("../models/WaitingList");
    const list = await WaitingList.find({ user: req.user.id })
      .populate("book", "title author")
      .sort({ createdAt: 1 });

    res.json({ success: true, data: list });
  } catch (error) {
    // Si le modèle WaitingList n'existe pas encore, retourner tableau vide
    res.json({ success: true, data: [] });
  }
};

module.exports = {
  getMyBorrowings,
  borrowBook,
  returnBook,
  renewBorrowing,
  updateNote,
  getMyWaitingList,
};
