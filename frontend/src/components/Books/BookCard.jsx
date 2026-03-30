import React from "react";

const BookCard = (props) => {
  const { books, loading, onViewDetails, onBorrow, onJoinWaitingList } = props;

  // 1. GESTION DU CHARGEMENT
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. SI C'EST UNE LISTE (Utilisé comme BookResults)
  if (books && Array.isArray(books)) {
    if (books.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            Aucun livre trouvé pour cette recherche.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((b) => (
          <BookCard
            key={b._id}
            book={b}
            onViewDetails={onViewDetails}
            onBorrow={onBorrow}
            onJoinWaitingList={onJoinWaitingList}
          />
        ))}
      </div>
    );
  }

  // 3. SI C'EST UN SEUL LIVRE (Affichage de la carte)
  const book = props.book;
  if (!book) return null; // Sécurité si book est absent

  const {
    title = "Unknown Title",
    author = "Unknown Author",
    genres = [],
    language = "English",
    averageRating = 0,
    totalReviews = 0,
    availableCopies = 0,
    totalCopies = 0,
    location = {},
    status = "unavailable",
    coverImage = null,
    publishedYear,
  } = book;

  const statusStyles = {
    available: { className: "bg-green-100 text-green-800", label: "Available" },
    limited: { className: "bg-yellow-100 text-yellow-800", label: "Limited" },
    unavailable: { className: "bg-red-100 text-red-800", label: "Unavailable" },
  };
  const s = statusStyles[status] || statusStyles.unavailable;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:border-gray-300 transition-shadow hover:shadow-md">
      {/* Cover */}
      <div className="bg-gray-100 h-40 flex items-center justify-center relative">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-32 w-auto rounded shadow-sm object-cover"
          />
        ) : (
          <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-[10px] text-center px-1">
            No Cover
          </div>
        )}
        <span
          className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${s.className}`}
        >
          {s.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight h-10">
          {title}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {author}
          {publishedYear ? ` · ${publishedYear}` : ""}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 h-5 overflow-hidden">
          {genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1">
          <span className="flex items-center text-yellow-600 font-bold">
            ★ {averageRating.toFixed(1)}
          </span>
          <span>{totalReviews} avis</span>
          <span className="uppercase">{language.substring(0, 3)}</span>
        </div>

        {/* Copies */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex justify-between text-[10px] text-gray-500 font-medium">
          <span>
            {availableCopies} / {totalCopies} dispos
          </span>
          {location?.shelf && <span>Rayon {location.shelf}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 py-3 border-t border-gray-100 flex gap-2 bg-gray-50/50">
        <button
          onClick={() => onViewDetails?.(book)}
          className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
        >
          Détails
        </button>
        {status === "unavailable" ? (
          <button
            onClick={() => onJoinWaitingList?.(book)}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            Attente
          </button>
        ) : (
          <button
            onClick={() => onBorrow?.(book)}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Emprunter
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
