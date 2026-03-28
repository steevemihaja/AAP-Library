import React from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/20/solid";
import { ClockIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const BookCard = ({ book }) => {
  const statusColors = {
    available: "bg-green-100 text-green-800",
    limited: "bg-yellow-100 text-yellow-800",
    unavailable: "bg-red-100 text-red-800",
  };

  const statusText = {
    available: "Available",
    limited: "Limited Copies",
    unavailable: "Unavailable",
  };

  return (
    <Link to={`/books/${book._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 bg-gray-200">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpenIcon className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColors[book.status]}`}
          >
            {statusText[book.status]}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(book.averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-500">
              ({book.totalReviews} reviews)
            </span>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span className="flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              {book.availableCopies}/{book.totalCopies} available
            </span>
            {book.genres && book.genres.length > 0 && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {book.genres[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
