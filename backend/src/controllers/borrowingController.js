const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const User = require('../models/User');
const WaitingList = require('../models/WaitingList');
const moment = require('moment');

// @desc    Borrow a book
// @route   POST /api/borrowings
// @access  Private
const borrowBook = async (req, res, next) => {
    try {
        const { bookId, dueDate } = req.body;
        const userId = req.user.id;

        // Check if book exists and is available
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Book is not available for borrowing'
            });
        }

        // Check if user already has this book borrowed
        const existingBorrowing = await Borrowing.findOne({
            user: userId,
            book: bookId,
            status: { $in: ['active', 'overdue'] }
        });

        if (existingBorrowing) {
            return res.status(400).json({
                success: false,
                error: 'You already have this book borrowed'
            });
        }

        // Check user's borrowing limit (max 5 books)
        const activeBorrowings = await Borrowing.countDocuments({
            user: userId,
            status: { $in: ['active', 'overdue'] }
        });

        if (activeBorrowings >= 5) {
            return res.status(400).json({
                success: false,
                error: 'You have reached the maximum borrowing limit (5 books)'
            });
        }

        // Create borrowing record
        const borrowing = await Borrowing.create({
            user: userId,
            book: bookId,
            dueDate: dueDate || moment().add(14, 'days').toDate() // Default 14 days
        });

        // Update book available copies
        book.availableCopies -= 1;
        book.borrowings.push(borrowing._id);
        await book.save();

        // Update user's borrowed books
        await User.findByIdAndUpdate(userId, {
            $push: { borrowedBooks: borrowing._id }
        });

        // Remove from waiting list if exists
        await WaitingList.findOneAndDelete({
            user: userId,
            book: bookId,
            status: 'waiting'
        });

        res.status(201).json({
            success: true,
            data: borrowing
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Return a book
// @route   PUT /api/borrowings/:id/return
// @access  Private
const returnBook = async (req, res, next) => {
    try {
        const borrowing = await Borrowing.findById(req.params.id)
            .populate('book')
            .populate('user');

        if (!borrowing) {
            return res.status(404).json({
                success: false,
                error: 'Borrowing record not found'
            });
        }

        if (borrowing.status === 'returned') {
            return res.status(400).json({
                success: false,
                error: 'Book already returned'
            });
        }

        // Update borrowing record
        borrowing.returnDate = new Date();
        borrowing.status = 'returned';
        borrowing.condition = req.body.condition || 'good';

        // Calculate penalty if overdue
        if (new Date() > borrowing.dueDate) {
            borrowing.status = 'overdue';
            borrowing.calculatePenalty();
        }

        await borrowing.save();

        // Update book available copies
        const book = await Book.findById(borrowing.book._id);
        book.availableCopies += 1;
        await book.save();

        // Check waiting list for this book
        const nextInLine = await WaitingList.findOne({
            book: borrowing.book._id,
            status: 'waiting'
        }).sort({ position: 1 });

        if (nextInLine) {
            // Notify user (in real app, send email/notification)
            nextInLine.status = 'notified';
            nextInLine.notifiedAt = new Date();
            nextInLine.expiresAt = moment().add(48, 'hours').toDate();
            await nextInLine.save();
        }

        res.json({
            success: true,
            data: borrowing,
            penalty: borrowing.penalty.amount > 0 ? borrowing.penalty : null
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Renew a book
// @route   PUT /api/borrowings/:id/renew
// @access  Private
const renewBook = async (req, res, next) => {
    try {
        const borrowing = await Borrowing.findById(req.params.id);

        if (!borrowing) {
            return res.status(404).json({
                success: false,
                error: 'Borrowing record not found'
            });
        }

        // Check if renewal is allowed
        if (borrowing.status !== 'active') {
            return res.status(400).json({
                success: false,
                error: 'Cannot renew a non-active borrowing'
            });
        }

        if (borrowing.renewalCount >= 2) {
            return res.status(400).json({
                success: false,
                error: 'Maximum renewal limit reached (2 times)'
            });
        }

        // Check if book is not reserved
        const waitingListCount = await WaitingList.countDocuments({
            book: borrowing.book,
            status: 'waiting'
        });

        if (waitingListCount > 0) {
            return res.status(400).json({
                success: false,
                error: 'Cannot renew - book is in waiting list'
            });
        }

        // Renew the book (add 7 more days)
        borrowing.dueDate = moment(borrowing.dueDate).add(7, 'days').toDate();
        borrowing.renewalCount += 1;
        borrowing.renewedAt.push(new Date());
        await borrowing.save();

        res.json({
            success: true,
            data: borrowing
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's borrowing history
// @route   GET /api/borrowings/my-borrowings
// @access  Private
const getMyBorrowings = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { user: req.user.id };
        if (status) {
            query.status = status;
        }

        const borrowings = await Borrowing.find(query)
            .populate({
                path: 'book',
                select: 'title author isbn coverImage'
            })
            .sort({ borrowDate: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Borrowing.countDocuments(query);

        res.json({
            success: true,
            data: borrowings,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check overdue books (Admin only)
// @route   GET /api/borrowings/overdue
// @access  Private (Admin/Librarian)
const getOverdueBooks = async (req, res, next) => {
    try {
        const overdueBooks = await Borrowing.find({
            status: 'overdue'
        })
        .populate('user', 'firstName lastName email phone')
        .populate('book', 'title author isbn');

        res.json({
            success: true,
            data: overdueBooks
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    borrowBook,
    returnBook,
    renewBook,
    getMyBorrowings,
    getOverdueBooks
};