import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const isAdmin = user.role === "admin" || user.role === "librarian";

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Bienvenue sur votre tableau de bord
        </h1>
        <p className="text-gray-600">Connecté en tant que {user.email}</p>
        {isAdmin && (
          <p className="text-sm text-blue-600 mt-1 font-medium">
            🔑 Rôle : {user.role}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold mb-2">📚 Mes emprunts</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500">livres empruntés</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold mb-2">⏳ En cours</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
          <p className="text-sm text-gray-500">emprunts actifs</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold mb-2">⭐ Mes avis</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
          <p className="text-sm text-gray-500">avis donnés</p>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">⚙️ Administration</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/books/add"
              className="flex items-center space-x-3 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-semibold text-blue-600">Ajouter un livre</p>
                <p className="text-xs text-gray-500">Ajouter au catalogue</p>
              </div>
            </Link>
            <Link
              to="/books"
              className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-gray-600">Voir les livres</p>
                <p className="text-xs text-gray-500">Gérer le catalogue</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
