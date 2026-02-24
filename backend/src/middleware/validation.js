const { body, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    };
};

// Validation rules
const userValidation = {
    register: [
        body('firstName').notEmpty().withMessage('First name is required').trim(),
        body('lastName').notEmpty().withMessage('Last name is required').trim(),
        body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
        body('address.street').optional().trim(),
        body('address.city').optional().trim(),
        body('address.postalCode').optional().trim(),
        body('address.country').optional().trim()
    ],
    login: [
        body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required')
    ]
};

const bookValidation = {
    create: [
        body('title').notEmpty().withMessage('Title is required').trim(),
        body('author').notEmpty().withMessage('Author is required').trim(),
        body('isbn').notEmpty().withMessage('ISBN is required').matches(/^(?=(?:\D*\d){10,13}$)[\d-]+$/).withMessage('Please provide a valid ISBN'),
        body('genres').isArray().withMessage('Genres must be an array'),
        body('totalCopies').isInt({ min: 0 }).withMessage('Total copies must be a positive number'),
        body('publishedYear').optional().isInt({ min: 1000, max: new Date().getFullYear() })
    ]
};

const borrowingValidation = {
    create: [
        body('bookId').isMongoId().withMessage('Valid book ID is required'),
        body('dueDate').isISO8601().withMessage('Valid due date is required')
    ]
};

module.exports = { validate, userValidation, bookValidation, borrowingValidation };