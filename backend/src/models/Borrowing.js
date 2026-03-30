const mongoose = require("mongoose");

const borrowingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: Date,

    renewedAt: {
      type: [Date],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "returned", "overdue", "lost"],
      default: "active",
    },

    renewalCount: {
      type: Number,
      default: 0,
    },

    notes: String,

    condition: {
      type: String,
      enum: ["good", "fair", "poor", "damaged"],
      default: "good",
    },

    penalty: {
      amount: { type: Number, default: 0 },
      paid: { type: Boolean, default: false },
      daysLate: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Borrowing", borrowingSchema);
