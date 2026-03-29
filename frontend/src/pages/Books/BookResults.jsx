import React from 'react';
import BookCard from './BookCard';

const BookResults = ({
  books = [],
  loading = false,
  searchQuery = '',
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onViewDetails,
  onBorrow,
  onJoinWaitingList,
}) => {

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-40" />
            <div className="p-4 flex flex-col gap-3">
              <div className="bg-gray-200 h-3 rounded w-4/5" />
              <div className="bg-gray-200 h-3 rounded w-3/5" />
              <div className="bg-gray-200 h-3 rounded w-2/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-4">📚</p>
        <p className="text-base font-medium text-gray-700 mb-2">No books found</p>
        {searchQuery && (
          <p className="text-sm">No results for "{searchQuery}". Try different keywords.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        <strong className="text-gray-800">{totalResults}</strong> book{totalResults !== 1 ? 's' : ''} found
        {searchQuery ? ` for "${searchQuery}"` : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {books.map(book => (
          <BookCard
            key={book._id}
            book={book}
            onViewDetails={onViewDetails}
            onBorrow={onBorrow}
            onJoinWaitingList={onJoinWaitingList}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookResults;