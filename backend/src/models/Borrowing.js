const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue', 'lost'],
        default: 'active'
    },
    renewalCount: {
        type: Number,
        default: 0,
        max: 2
    },
    renewedAt: [Date],
    penalty: {
        amount: {
            type: Number,
            default: 0
        },
        paid: {
            type: Boolean,
            default: false
        },
        paidDate: Date
    },
    notes: {
        type: String,
        maxlength: 500
    },
    condition: {
        type: String,
        enum: ['good', 'fair', 'poor', 'damaged'],
        default: 'good'
    }
}, {
    timestamps: true
});

// Calculate penalty for overdue books
borrowingSchema.methods.calculatePenalty = function() {
    if (this.status === 'overdue' && !this.returnDate) {
        const today = new Date();
        const dueDate = new Date(this.dueDate);
        const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        
        // Penalty: $1 per day overdue
        this.penalty.amount = daysOverdue * 1;
        return this.penalty.amount;
    }
    return 0;
};

// Check if book is overdue
borrowingSchema.pre('save', function(next) {
    if (this.status === 'active' && new Date() > this.dueDate) {
        this.status = 'overdue';
        this.calculatePenalty();
    }
    next();
});

module.exports = mongoose.model('Borrowing', borrowingSchema);