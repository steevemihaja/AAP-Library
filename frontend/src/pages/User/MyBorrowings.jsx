import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [penalties, setPenalties] = useState(0);
  const navigate = useNavigate();
  
  // Récupération des informations de l'utilisateur stockées lors de la connexion
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    // Redirection vers la page de connexion si l'utilisateur n'est pas identifié
    if (!user) {
      navigate('/login');
      return;
    }
    loadBorrowings();
  }, []);

  // Fonction pour charger la liste des emprunts depuis l'API
  const loadBorrowings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/borrowings/my-borrowings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await res.json();
      
      // Gestion de la structure des données : accepte soit un tableau direct, soit result.data
      const actualData = Array.isArray(result) ? result : (result.data || []);
      
      setBorrowings(actualData);
      
      // Calcul du montant total des pénalités accumulées
      const totalPenalties = actualData.reduce((sum, b) => sum + (b.penalty?.amount || 0), 0);
      setPenalties(totalPenalties);
      
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour retourner un livre
  const handleReturn = async (borrowingId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/borrowings/${borrowingId}/return`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success || res.ok) {
        alert('📤 Livre retourné avec succès !');
        loadBorrowings(); // Recharger la liste après l'action
      }
    } catch (err) {
      alert('Erreur lors du retour du livre');
    }
  };

  // Fonction pour prolonger la durée d'un emprunt
  const handleRenew = async (borrowingId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/borrowings/${borrowingId}/renew`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success || res.ok) {
        alert('🔄 Emprunt prolongé avec succès !');
        loadBorrowings(); // Recharger la liste après l'action
      }
    } catch (err) {
      alert('Erreur lors du renouvellement');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Chargement de vos emprunts...</div>;

  // Filtrage des emprunts pour les compteurs du tableau de bord
  // On inclut 'pending' pour que l'utilisateur voie ses demandes en attente
  const activeAndPending = borrowings.filter(b => b.status === 'active' || b.status === 'pending');
  const overdueBorrowings = borrowings.filter(b => b.status === 'overdue');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <span>📋</span> Mes emprunts
        </h1>

        {/* Section Résumé : Affiche les compteurs d'emprunts et pénalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Emprunts en cours</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{activeAndPending.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">En retard</p>
            <p className="text-4xl font-bold text-red-500 mt-2">{overdueBorrowings.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pénalités totales</p>
            <p className="text-4xl font-bold text-amber-600 mt-2">{penalties}€</p>
          </div>
        </div>

        {/* Affichage de la liste ou d'un message si vide */}
        {borrowings.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-200 text-center">
            <p className="text-gray-400 text-lg">Vous n'avez aucun emprunt pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {borrowings.map(b => {
              const dueDate = new Date(b.dueDate);
              const isOverdue = new Date() > dueDate && b.status !== 'returned';
              const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={b._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{b.book?.title || 'Titre inconnu'}</h3>
                    <p className="text-gray-500">par {b.book?.author || 'Auteur inconnu'}</p>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      <p><span className="text-gray-400">Date d'emprunt :</span> {new Date(b.borrowDate).toLocaleDateString()}</p>
                      <p className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                        {b.status === 'returned' ? '✅ Retourné' : 
                         isOverdue ? `❌ EN RETARD (${Math.abs(daysLeft)} j)` : 
                         `📅 Retour le : ${dueDate.toLocaleDateString()} (${daysLeft} j)`}
                      </p>
                    </div>
                  </div>

                  {/* Boutons d'actions : Retourner ou Prolonger */}
                  <div className="flex gap-2">
                    {b.status !== 'returned' && (
                      <>
                        <button 
                          onClick={() => handleReturn(b._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          Retourner
                        </button>
                        {/* On ne peut prolonger que si le livre n'est pas en retard et limite de 2 fois */}
                        {!isOverdue && (b.renewalCount || 0) < 2 && (
                          <button 
                            onClick={() => handleRenew(b._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            Prolonger
                          </button>
                        )}
                      </>
                    )}
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