const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      index: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      index: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
      match: [/^(?=(?:\D*\d){10,13}$)[\d-]+$/, "Please enter a valid ISBN"],
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    genres: [
      {
        type: String,
        enum: [
          "Fiction",
          "Non-Fiction",
          "Science Fiction",
          "Fantasy",
          "Mystery",
          "Thriller",
          "Romance",
          "Biography",
          "History",
          "Self-Help",
          "Poetry",
          "Drama",
          "Horror",
          "Adventure",
          "Children",
          "Young Adult",
          "Classic",
          "Philosophy",
          "Religion",
          "Science",
          "Technology",
          "Art",
          "Music",
          "Travel",
          "Cooking",
          "Sports",
          "Business",
          "Economics",
        ],
      },
    ],
    publisher: {
      type: String,
      trim: true,
    },
    publishedYear: {
      type: Number,
      min: [1000, "Invalid publication year"],
      max: [
        new Date().getFullYear(),
        "Publication year cannot be in the future",
      ],
    },
 language: {
  type: String,
  default: "English",
  validate: {
    validator: function() { return true; },
    message: ''
  }
},

    pages: {
      type: Number,
      min: [1, "Pages must be at least 1"],
    },
    coverImage: {
      type: String,
      default: null,
    },
    totalCopies: {
      type: Number,
      required: true,
      min: [0, "Total copies cannot be negative"],
      default: 1,
    },
    availableCopies: {
      type: Number,
      min: [0, "Available copies cannot be negative"],
      default: 1,
    },
    location: {
      shelf: String,
      row: String,
      section: String,
    },
    status: {
      type: String,
      enum: ["available", "limited", "unavailable"],
      default: "available",
    },
    borrowings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Borrowing",
      },
    ],
    waitingList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WaitingList",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  {
    timestamps: true,
  },
);

// Index for search functionality
bookSchema.index({ title: "text", author: "text", description: "text" });

// Update status based on available copies
bookSchema.pre("save", function (next) {
  if (this.availableCopies === 0) {
    this.status = "unavailable";
  } else if (this.availableCopies < this.totalCopies * 0.3) {
    this.status = "limited";
  } else {
    this.status = "available";
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
