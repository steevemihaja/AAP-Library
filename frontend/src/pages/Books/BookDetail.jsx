import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, title: '', content: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  const loadBookDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`);
      const data = await res.json();
      setBook(data.data);
      
      // Charger les avis
      const reviewsRes = await fetch(`http://localhost:5000/api/books/${id}/reviews`);
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData.data || []);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!user) {
      alert('Veuillez vous connecter pour emprunter');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/borrowings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: id,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert('✅ Livre emprunté avec succès !');
        loadBookDetails(); // Recharger pour mettre à jour la disponibilité
      } else {
        alert(data.error || 'Erreur lors de l\'emprunt');
      }
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  const handleJoinWaitingList = async () => {
    if (!user) {
      alert('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/waiting-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId: id })
      });
      
      const data = await res.json();
      if (data.success) {
        alert('📝 Vous êtes sur la liste d\'attente !');
      } else {
        alert(data.error || 'Erreur');
      }
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: id,
          ...userReview
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert('⭐ Avis ajouté !');
        setShowReviewForm(false);
        loadBookDetails(); // Recharger les avis
      }
    } catch (err) {
      alert('Erreur');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  if (!book) return <div style={{ padding: '2rem', textAlign: 'center' }}>Livre non trouvé</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          ← Retour
        </button>

        <div style={{ background: 'white', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Couverture */}
            <div style={{ background: '#e5e7eb', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '8rem' }}>📖</div>
            </div>

            {/* Infos */}
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{book.title}</h1>
              <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '1rem' }}>par {book.author}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <strong>ISBN:</strong> {book.isbn || 'N/A'}
                </div>
                <div>
                  <strong>Publié:</strong> {book.publishedYear || 'N/A'}
                </div>
                <div>
                  <strong>Langue:</strong> {book.language || 'Français'}
                </div>
                <div>
                  <strong>Pages:</strong> {book.pages || 'N/A'}
                </div>
              </div>

              {/* Genres */}
              <div style={{ marginBottom: '2rem' }}>
                <strong>Genres:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {book.genres?.map(genre => (
                    <span key={genre} style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem'
                    }}>
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Disponibilité */}
              <div style={{ marginBottom: '2rem' }}>
                <strong>Disponibilité:</strong>
                <p style={{ 
                  fontSize: '1.5rem',
                  color: book.availableCopies > 0 ? '#059669' : '#dc2626',
                  fontWeight: 'bold'
                }}>
                  {book.availableCopies > 0 
                    ? `${book.availableCopies}/${book.totalCopies} exemplaires disponibles`
                    : 'Indisponible'}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                {book.availableCopies > 0 ? (
                  <button onClick={handleBorrow} style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                    📥 Emprunter ce livre
                  </button>
                ) : (
                  <button onClick={handleJoinWaitingList} style={{
                    background: '#d97706',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                    ⏳ Rejoindre la liste d'attente
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Description</h2>
              <p style={{ lineHeight: '1.6', color: '#4b5563' }}>{book.description}</p>
            </div>
          )}
        </div>

        {/* Section des avis */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Avis des lecteurs ⭐</h2>
            {user && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} style={{
                background: '#2563eb',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                ✏️ Écrire un avis
              </button>
            )}
          </div>

          {/* Formulaire d'avis */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} style={{ marginBottom: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '4px' }}>
              <h3>Nouvel avis</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label>Note:</label>
                <select 
                  value={userReview.rating}
                  onChange={e => setUserReview({...userReview, rating: parseInt(e.target.value)})}
                  style={{ marginLeft: '1rem', padding: '0.25rem' }}
                >
                  {[5,4,3,2,1].map(n => (
                    <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Titre de l'avis"
                  value={userReview.title}
                  onChange={e => setUserReview({...userReview, title: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <textarea
                  placeholder="Votre avis..."
                  value={userReview.content}
                  onChange={e => setUserReview({...userReview, content: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" style={{ background: '#059669', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Publier
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} style={{ background: '#6b7280', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Liste des avis */}
          {reviews.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>Aucun avis pour ce livre. Soyez le premier à donner votre avis !</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map(review => (
                <div key={review._id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{review.title}</strong>
                    <span>{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>{review.content}</p>
                  <small style={{ color: '#9ca3af' }}>
                    Par {review.user?.firstName} {review.user?.lastName}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
