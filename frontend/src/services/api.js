import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || 'An error occurred';
        
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        } else {
            toast.error(message);
        }
        
        return Promise.reject(error);
    }
);

// ==================== AUTHENTIFICATION ====================

/**
 * Connexion utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise} - Promise avec les données de connexion
 */
export const login = (email, password) => {
    return api.post('/auth/login', { email, password });
};

/**
 * Inscription utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @param {string} userData.firstName - Prénom
 * @param {string} userData.lastName - Nom
 * @param {string} userData.email - Email
 * @param {string} userData.password - Mot de passe
 * @param {string} [userData.phone] - Téléphone (optionnel)
 * @param {Object} [userData.address] - Adresse (optionnel)
 * @returns {Promise} - Promise avec les données d'inscription
 */
export const register = (userData) => {
    return api.post('/auth/register', userData);
};

/**
 * Récupérer l'utilisateur connecté
 * @returns {Promise} - Promise avec les données de l'utilisateur
 */
export const getCurrentUser = () => {
    return api.get('/auth/me');
};

/**
 * Mettre à jour le profil utilisateur
 * @param {Object} profileData - Données du profil à mettre à jour
 * @returns {Promise} - Promise avec les données mises à jour
 */
export const updateProfile = (profileData) => {
    return api.put('/auth/profile', profileData);
};

// ==================== GESTION DES LIVRES ====================

/**
 * Récupérer tous les livres avec filtres et pagination
 * @param {Object} params - Paramètres de recherche
 * @param {number} [params.page=1] - Numéro de page
 * @param {number} [params.limit=10] - Nombre d'éléments par page
 * @param {string} [params.search] - Recherche textuelle
 * @param {string} [params.genre] - Filtre par genre
 * @param {string} [params.author] - Filtre par auteur
 * @param {string} [params.language] - Filtre par langue
 * @param {number} [params.minRating] - Note minimum
 * @param {number} [params.maxRating] - Note maximum
 * @param {string} [params.status] - Statut du livre
 * @param {string} [params.sortBy] - Champ de tri
 * @param {string} [params.sortOrder] - Ordre de tri (asc/desc)
 * @returns {Promise} - Promise avec la liste des livres
 */
export const getBooks = (params = {}) => {
    return api.get('/books', { params });
};

/**
 * Récupérer un livre par son ID
 * @param {string} id - ID du livre
 * @returns {Promise} - Promise avec les détails du livre
 */
export const getBook = (id) => {
    return api.get(`/books/${id}`);
};

/**
 * Créer un nouveau livre (admin/librarian uniquement)
 * @param {Object} bookData - Données du livre
 * @returns {Promise} - Promise avec le livre créé
 */
export const createBook = (bookData) => {
    return api.post('/books', bookData);
};

/**
 * Mettre à jour un livre (admin/librarian uniquement)
 * @param {string} id - ID du livre
 * @param {Object} bookData - Données à mettre à jour
 * @returns {Promise} - Promise avec le livre mis à jour
 */
export const updateBook = (id, bookData) => {
    return api.put(`/books/${id}`, bookData);
};

/**
 * Supprimer un livre (admin uniquement)
 * @param {string} id - ID du livre
 * @returns {Promise} - Promise avec la confirmation de suppression
 */
export const deleteBook = (id) => {
    return api.delete(`/books/${id}`);
};

/**
 * Uploader la couverture d'un livre
 * @param {string} id - ID du livre
 * @param {FormData} formData - FormData contenant l'image
 * @returns {Promise} - Promise avec le livre mis à jour
 */
export const uploadBookCover = (id, formData) => {
    return api.post(`/books/${id}/cover`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// ==================== GESTION DES EMPRUNTS ====================

/**
 * Emprunter un livre
 * @param {Object} borrowingData - Données de l'emprunt
 * @param {string} borrowingData.bookId - ID du livre
 * @param {string} borrowingData.dueDate - Date de retour prévue
 * @returns {Promise} - Promise avec l'emprunt créé
 */
export const borrowBook = (borrowingData) => {
    return api.post('/borrowings', borrowingData);
};

/**
 * Retourner un livre
 * @param {string} id - ID de l'emprunt
 * @param {Object} returnData - Données de retour
 * @param {string} returnData.condition - État du livre retourné
 * @returns {Promise} - Promise avec l'emprunt mis à jour
 */
export const returnBook = (id, returnData = {}) => {
    return api.put(`/borrowings/${id}/return`, returnData);
};

/**
 * Prolonger un emprunt
 * @param {string} id - ID de l'emprunt
 * @returns {Promise} - Promise avec l'emprunt prolongé
 */
export const renewBook = (id) => {
    return api.put(`/borrowings/${id}/renew`);
};

/**
 * Récupérer les emprunts de l'utilisateur connecté
 * @param {Object} params - Paramètres de filtrage
 * @param {string} [params.status] - Filtrer par statut
 * @param {number} [params.page=1] - Numéro de page
 * @param {number} [params.limit=10] - Nombre d'éléments par page
 * @returns {Promise} - Promise avec la liste des emprunts
 */
export const getMyBorrowings = (params = {}) => {
    return api.get('/borrowings/my-borrowings', { params });
};

/**
 * Récupérer les livres en retard (admin/librarian uniquement)
 * @returns {Promise} - Promise avec la liste des emprunts en retard
 */
export const getOverdueBooks = () => {
    return api.get('/borrowings/overdue');
};

// ==================== GESTION DES AVIS ====================

/**
 * Créer un avis sur un livre
 * @param {Object} reviewData - Données de l'avis
 * @param {string} reviewData.bookId - ID du livre
 * @param {number} reviewData.rating - Note (1-5)
 * @param {string} reviewData.title - Titre de l'avis
 * @param {string} reviewData.content - Contenu de l'avis
 * @returns {Promise} - Promise avec l'avis créé
 */
export const createReview = (reviewData) => {
    return api.post('/reviews', reviewData);
};

/**
 * Mettre à jour un avis
 * @param {string} id - ID de l'avis
 * @param {Object} reviewData - Données à mettre à jour
 * @returns {Promise} - Promise avec l'avis mis à jour
 */
export const updateReview = (id, reviewData) => {
    return api.put(`/reviews/${id}`, reviewData);
};

/**
 * Supprimer un avis
 * @param {string} id - ID de l'avis
 * @returns {Promise} - Promise avec la confirmation de suppression
 */
export const deleteReview = (id) => {
    return api.delete(`/reviews/${id}`);
};

/**
 * Marquer un avis comme utile
 * @param {string} id - ID de l'avis
 * @returns {Promise} - Promise avec l'avis mis à jour
 */
export const markReviewHelpful = (id) => {
    return api.post(`/reviews/${id}/helpful`);
};

// ==================== GESTION DE LA LISTE D'ATTENTE ====================

/**
 * Rejoindre la liste d'attente pour un livre
 * @param {string} bookId - ID du livre
 * @returns {Promise} - Promise avec l'entrée de liste d'attente créée
 */
export const joinWaitingList = (bookId) => {
    return api.post('/waiting-list', { bookId });
};

/**
 * Quitter la liste d'attente
 * @param {string} id - ID de l'entrée de liste d'attente
 * @returns {Promise} - Promise avec la confirmation de suppression
 */
export const leaveWaitingList = (id) => {
    return api.delete(`/waiting-list/${id}`);
};

/**
 * Récupérer la liste d'attente de l'utilisateur
 * @returns {Promise} - Promise avec la liste d'attente
 */
export const getMyWaitingList = () => {
    return api.get('/waiting-list/my-list');
};

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Sauvegarder les données utilisateur dans localStorage
 * @param {Object} user - Données utilisateur
 * @param {string} token - Token JWT
 */
export const setAuthData = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Récupérer les données utilisateur de localStorage
 * @returns {Object|null} - Données utilisateur ou null
 */
export const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * Vérifier si l'utilisateur est connecté
 * @returns {boolean} - True si connecté
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Déconnexion (nettoyage localStorage)
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

// Export par défaut de l'instance axios
export default api;