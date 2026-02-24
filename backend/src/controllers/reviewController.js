const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
    try {
        const { bookId, rating, title, content } = req.body;

        // Check if user has borrowed this book
        const hasBorrowed = await Borrowing.findOne({
            user: req.user.id,
            book: bookId,
            status: 'returned'
        });

        if (!hasBorrowed && req.user.role === 'user') {
            return res.status(400).json({
                success: false,
                error: 'You can only review books you have borrowed'
            });
        }

        // Create review
        const review = await Review.create({
            user: req.user.id,
            book: bookId,
            rating,
            title,
            content,
            status: req.user.role === 'admin' ? 'approved' : 'pending'
        });

        // Update book's reviews and average rating
        const book = await Book.findById(bookId);
        book.reviews.push(review._id);
        
        // Calculate new average rating
        const allReviews = await Review.find({ book: bookId, status: 'approved' });
        const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
        book.averageRating = avgRating || 0;
        book.totalReviews = allReviews.length;
        
        await book.save();

        res.status(201).json({
            success: true,
            data: review
        });
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
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        // Check ownership
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this review'
            });
        }

        // Update fields
        if (req.body.rating) review.rating = req.body.rating;
        if (req.body.title) review.title = req.body.title;
        if (req.body.content) review.content = req.body.content;

        // Reset status to pending if changed by non-admin
        if (req.user.role !== 'admin') {
            review.status = 'pending';
        }

        await review.save();

        // Update book average rating
        const book = await Book.findById(review.book);
        const allReviews = await Review.find({ book: review.book, status: 'approved' });
        const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
        book.averageRating = avgRating || 0;
        await book.save();

        res.json({
            success: true,
            data: review
        });
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
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        // Check ownership
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this review'
            });
        }

        await review.remove();

        // Update book
        const book = await Book.findById(review.book);
        book.reviews.pull(review._id);
        
        const allReviews = await Review.find({ book: review.book, status: 'approved' });
        const avgRating = allReviews.length > 0 
            ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length 
            : 0;
        
        book.averageRating = avgRating;
        book.totalReviews = allReviews.length;
        await book.save();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
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
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        review.helpful += 1;
        await review.save();

        res.json({
            success: true,
            helpful: review.helpful
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    markHelpful
};