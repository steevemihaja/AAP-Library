import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BookResults from '../../components/Books/BookCard';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [minRating, setMinRating] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const genres = ['Fiction', 'Science Fiction', 'Fantasy', 'Classic', 'Aventure', 'Dystopie', 'Philosophie', 'Jeunesse', 'Historique', 'Romance'];

  useEffect(() => {
    loadBooks();
  }, [page, selectedGenre, minRating, author]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/books?page=${page}&limit=12`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedGenre) url += `&genre=${encodeURIComponent(selectedGenre)}`;
      if (author) url += `&author=${encodeURIComponent(author)}`;
      if (minRating) url += `&minRating=${minRating}`;

      const res = await fetch(url);
      const data = await res.json();

      setBooks(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalBooks(data.pagination?.totalItems || 0);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // FONCTION POUR EMPRUNTER UN LIVRE 
 const handleBorrow = async (book) => {
  if (!user) {
    alert("Veuillez vous connecter pour emprunter un livre.");
    navigate('/login');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    
    
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);

    const res = await fetch('http://localhost:5000/api/borrowings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        bookId: book._id,
        dueDate: defaultDueDate.toISOString() 
      })
    });

    const result = await res.json();

    if (res.ok) {
      alert(`Succès : Vous avez emprunté "${book.title}"`);
      loadBooks();
    } else {
    
      const errorMsg = result.errors && result.errors.length > 0 
        ? result.errors[0].msg 
        : (result.error || "Erreur de validation");
        
      alert(`Impossible d'emprunter : ${errorMsg}`);
      console.log("Détail de l'erreur validator :", result.errors);
    }
  } catch (err) {
    console.error("Erreur:", err);
    alert("Erreur de connexion au serveur.");
  }
};
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadBooks();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setAuthor('');
    setMinRating('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header et Recherche (Code inchangé) */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catalogue</h1>
            <p className="text-gray-600 mt-1">{totalBooks} livres disponibles</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <span>Filtres</span>
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un livre par titre, auteur ou ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-12 pr-24 py-4 text-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Rechercher
            </button>
          </div>
        </form>

        {/* Filtres (Code inchangé) */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="border p-2 rounded">
                 <option value="">Tous les genres</option>
                 {genres.map(g => <option key={g} value={g}>{g}</option>)}
               </select>
               <input type="text" placeholder="Auteur" value={author} onChange={(e) => setAuthor(e.target.value)} className="border p-2 rounded" />
               <button onClick={resetFilters} className="border p-2 rounded bg-gray-50">Réinitialiser</button>
             </div>
          </div>
        )}

        {/* Résultats :  onBorrow={handleBorrow} */}
        <BookResults
          books={books}
          loading={loading}
          searchQuery={searchTerm}
          totalResults={totalBooks}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          onViewDetails={(book) => navigate(`/books/${book._id}`)}
          onBorrow={handleBorrow} 
        />

      </div>
    </div>
  );
};

export default BookList;