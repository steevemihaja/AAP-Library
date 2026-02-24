const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
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
    position: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'notified', 'expired', 'cancelled'],
        default: 'waiting'
    },
    notifiedAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['normal', 'high', 'low'],
        default: 'normal'
    }
}, {
    timestamps: true
});

// Ensure unique position per book
waitingListSchema.index({ book: 1, position: 1 }, { unique: true });
waitingListSchema.index({ user: 1, book: 1, status: 'waiting' }, { unique: true });

module.exports = mongoose.model('WaitingList', waitingListSchema);