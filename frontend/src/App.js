import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import BookList from "./pages/Books/BookList";
import BookDetail from "./pages/Books/BookDetail";
import MyBorrowings from "./pages/User/MyBorrowings";
import Dashboard from "./pages/Dashboard";
import BookAdd from "./pages/Books/BookAdd";
import "./index.css";

// Composant Navbar
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user?.role === "admin" || user?.role === "librarian";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              LibraryManager
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 transition font-medium"
            >
              Accueil
            </Link>
            <Link
              to="/books"
              className="text-gray-600 hover:text-primary-600 transition font-medium"
            >
              Livres
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/my-borrowings"
                  className="text-gray-600 hover:text-primary-600 transition font-medium"
                >
                  Mes emprunts
                </Link>

                {/* ✅ Lien Ajouter un livre pour admin/librarian */}
                {isAdmin && (
                  <Link
                    to="/books/add"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    + Ajouter un livre
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  {/* ✅ Avatar cliquable vers dashboard */}
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 hover:opacity-80 transition"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.firstName}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition font-medium px-4 py-2"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-xl mb-12">
    <div className="absolute inset-0 bg-black opacity-10"></div>
    <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
        Bienvenue à la Bibliothèque
      </h1>
      <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
        Découvrez des milliers de livres, gérez vos emprunts et partagez vos
        avis
      </p>
      <Link
        to="/books"
        className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition transform hover:scale-105"
      >
        <span>Explorer le catalogue</span>
        <svg
          className="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  </div>
);

// Features Grid
const FeaturesGrid = () => {
  const features = [
    {
      icon: "📖",
      title: "Catalogue complet",
      description: "Parcourez des milliers de livres avec recherche avancée",
      color: "bg-blue-50/80",
      iconColor: "text-blue-600",
    },
    {
      icon: "🔄",
      title: "Emprunts faciles",
      description: "Empruntez, prolongez et retournez en quelques clics",
      color: "bg-green-50/80",
      iconColor: "text-green-600",
    },
    {
      icon: "⭐",
      title: "Avis et notes",
      description: "Partagez votre avis et découvrez les recommandations",
      color: "bg-yellow-50/80",
      iconColor: "text-yellow-600",
    },
    {
      icon: "🔍",
      title: "Recherche avancée",
      description: "Filtrez par genre, auteur, note et disponibilité",
      color: "bg-purple-50/80",
      iconColor: "text-purple-600",
    },
    {
      icon: "⏳",
      title: "Listes d'attente",
      description: "Réservez les livres indisponibles",
      color: "bg-orange-50/80",
      iconColor: "text-orange-600",
    },
    {
      icon: "💰",
      title: "Pénalités automatiques",
      description: "Gestion des retards et des pénalités",
      color: "bg-red-50/80",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 hover:scale-105"
        >
          <div
            className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}
          >
            <span className={`text-3xl ${feature.iconColor}`}>
              {feature.icon}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

// Page d'accueil
const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HeroSection />
      <FeaturesGrid />
    </main>
  </div>
);

// Layout avec Navbar pour les pages internes
const WithNavbar = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/books"
            element={
              <WithNavbar>
                <BookList />
              </WithNavbar>
            }
          />
          <Route
            path="/books/:id"
            element={
              <WithNavbar>
                <BookDetail />
              </WithNavbar>
            }
          />
          <Route
            path="/my-borrowings"
            element={
              <WithNavbar>
                <MyBorrowings />
              </WithNavbar>
            }
          />
          {/* ✅ Routes ajoutées */}
          <Route
            path="/dashboard"
            element={
              <WithNavbar>
                <Dashboard />
              </WithNavbar>
            }
          />
          <Route
            path="/books/add"
            element={
              <WithNavbar>
                <BookAdd />
              </WithNavbar>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
