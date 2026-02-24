const Book = require('../models/Book');
const Review = require('../models/Review');

// @desc    Get all books with filtering, pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            genre,
            author,
            language,
            minRating,
            maxRating,
            status,
            sortBy = 'title',
            sortOrder = 'asc'
        } = req.query;

        // Build query
        const query = {};

        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }

        // Filters
        if (genre) {
            query.genres = genre;
        }

        if (author) {
            query.author = { $regex: author, $options: 'i' };
        }

        if (language) {
            query.language = language;
        }

        if (status) {
            query.status = status;
        }

        if (minRating || maxRating) {
            query.averageRating = {};
            if (minRating) query.averageRating.$gte = parseFloat(minRating);
            if (maxRating) query.averageRating.$lte = parseFloat(maxRating);
        }

        // Pagination
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const total = await Book.countDocuments(query);

        // Sorting
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const books = await Book.find(query)
            .populate('reviews')
            .sort(sort)
            .limit(parseInt(limit))
            .skip(startIndex);

        // Pagination result
        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit)
        };

        res.json({
            success: true,
            data: books,
            pagination
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'firstName lastName profilePicture'
                },
                match: { status: 'approved' }
            })
            .populate('waitingList');

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create book
// @route   POST /api/books
// @access  Private (Librarian/Admin)
const createBook = async (req, res, next) => {
    try {
        // Set available copies equal to total copies initially
        req.body.availableCopies = req.body.totalCopies;

        const book = await Book.create(req.body);

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian/Admin)
const updateBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin only)
const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Check if book has active borrowings
        const hasActiveBorrowings = book.borrowings.some(b => b.status === 'active');
        if (hasActiveBorrowings) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete book with active borrowings'
            });
        }

        await book.remove();

        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload book cover
// @route   POST /api/books/:id/cover
// @access  Private (Librarian/Admin)
const uploadCover = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please upload a file'
            });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { coverImage: req.file.path },
            { new: true }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    uploadCover
};