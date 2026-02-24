import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [penalties, setPenalties] = useState(0);
  const navigate = useNavigate();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBorrowings();
  }, []);

  const loadBorrowings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/borrowings/my-borrowings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBorrowings(data.data || []);
      
      // Calculer les pénalités
      const totalPenalties = (data.data || []).reduce((sum, b) => sum + (b.penalty?.amount || 0), 0);
      setPenalties(totalPenalties);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowingId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/borrowings/${borrowingId}/return`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('📤 Livre retourné !');
        loadBorrowings();
      }
    } catch (err) {
      alert('Erreur');
    }
  };

  const handleRenew = async (borrowingId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/borrowings/${borrowingId}/renew`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('🔄 Emprunt prolongé !');
        loadBorrowings();
      }
    } catch (err) {
      alert('Erreur');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>📋 Mes emprunts</h1>

        {/* Résumé */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div>
            <strong>Emprunts en cours:</strong>
            <p style={{ fontSize: '2rem', color: '#2563eb' }}>{borrowings.filter(b => b.status === 'active').length}</p>
          </div>
          <div>
            <strong>En retard:</strong>
            <p style={{ fontSize: '2rem', color: '#dc2626' }}>{borrowings.filter(b => b.status === 'overdue').length}</p>
          </div>
          <div>
            <strong>Pénalités totales:</strong>
            <p style={{ fontSize: '2rem', color: '#d97706' }}>{penalties}€</p>
          </div>
        </div>

        {/* Liste des emprunts */}
        {borrowings.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Aucun emprunt</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {borrowings.map(b => {
              const isOverdue = new Date() > new Date(b.dueDate) && b.status !== 'returned';
              const daysLeft = Math.ceil((new Date(b.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={b._id} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{b.book?.title}</h3>
                      <p style={{ color: '#6b7280' }}>par {b.book?.author}</p>
                      
                      <div style={{ marginTop: '1rem' }}>
                        <p>Emprunté le: {new Date(b.borrowDate).toLocaleDateString()}</p>
                        <p style={{ color: isOverdue ? '#dc2626' : '#059669', fontWeight: 'bold' }}>
                          {b.status === 'returned' ? 'Retourné' : isOverdue ? `EN RETARD (${-daysLeft} jours)` : `Retour prévu: ${new Date(b.dueDate).toLocaleDateString()} (${daysLeft} jours restants)`}
                        </p>
                        {b.penalty?.amount > 0 && (
                          <p style={{ color: '#d97706' }}>Pénalité: {b.penalty.amount}€</p>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {b.status !== 'returned' && (
                        <>
                          <button onClick={() => handleReturn(b._id)} style={{
                            background: '#059669',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}>
                            📤 Retourner
                          </button>
                          {!isOverdue && b.renewalCount < 2 && (
                            <button onClick={() => handleRenew(b._id)} style={{
                              background: '#2563eb',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}>
                              🔄 Prolonger
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBorrowings;