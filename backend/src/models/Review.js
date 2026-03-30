const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 100 },
    content: { type: String, required: true, maxlength: 1000 },
    helpful: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    tags: [String],
  },
  { timestamps: true },
);

// Empêche un utilisateur de laisser deux avis sur le même livre
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
