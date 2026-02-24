const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate, borrowingValidation } = require('../middleware/validation');
const {
    borrowBook,
    returnBook,
    renewBook,
    getMyBorrowings,
    getOverdueBooks
} = require('../controllers/borrowingController');

router.route('/')
    .post(protect, validate(borrowingValidation.create), borrowBook);

router.get('/my-borrowings', protect, getMyBorrowings);
router.get('/overdue', protect, authorize('librarian', 'admin'), getOverdueBooks);
router.put('/:id/return', protect, returnBook);
router.put('/:id/renew', protect, renewBook);

module.exports = router;