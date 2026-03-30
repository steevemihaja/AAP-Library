import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Étoiles ────────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={readonly}
        onClick={() => !readonly && onChange && onChange(star)}
        className={`text-2xl transition ${
          readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
        } ${star <= value ? "text-amber-400" : "text-gray-300"}`}
      >
        ★
      </button>
    ))}
  </div>
);

// ── Modal générique ────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ── Composant principal ────────────────────────────────────────────────────
const MyBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [returnModal, setReturnModal] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [penaltyModal, setPenaltyModal] = useState(null);

  // Form states
  const [returnDate, setReturnDate] = useState("");
  const [noteText, setNoteText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewTags, setReviewTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadBorrowings();
    loadWaitingList();
  }, []);

  const getToken = () => localStorage.getItem("token");

  // ── Chargement des emprunts ─────────────────────────────────────────────
  const loadBorrowings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/borrowings/my-borrowings",
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const result = await res.json();
      // Le contrôleur retourne { success, data: [...] }
      const data = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];
      setBorrowings(data);
    } catch (err) {
      console.error("Erreur chargement emprunts :", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Chargement liste d'attente ──────────────────────────────────────────
  const loadWaitingList = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/borrowings/waitinglist/my-list",
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const result = await res.json();
      setWaitingList(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Erreur liste d'attente :", err);
    }
  };

  // ── Retour d'un livre ───────────────────────────────────────────────────
  const handleReturn = async () => {
    if (!returnModal) return;
    setSubmitting(true);

    const dateToSend = returnDate
      ? new Date(returnDate).toISOString()
      : new Date().toISOString();

    try {
      const res = await fetch(
        `http://localhost:5000/api/borrowings/${returnModal.borrowingId}/return`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            condition: "good",
            returnDate: dateToSend,
          }),
        },
      );
      const data = await res.json();

      if (data.success || res.ok) {
        setReturnModal(null);
        setReturnDate("");

        // ← Pénalité retournée par le backend et stockée en MongoDB
        if (data.penalty && data.penalty.amount > 0) {
          setPenaltyModal({
            penalty: data.penalty,
            bookTitle: returnModal.bookTitle,
          });
        } else {
          alert("📤 Livre retourné avec succès !");
        }

        // Recharger pour afficher les données à jour depuis MongoDB
        loadBorrowings();
      } else {
        alert(data.error || "Erreur lors du retour");
      }
    } catch {
      alert("Erreur lors du retour du livre");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Renouvellement ──────────────────────────────────────────────────────
  const handleRenew = async (borrowingId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/borrowings/${borrowingId}/renew`,
        { method: "PUT", headers: { Authorization: `Bearer ${getToken()}` } },
      );
      const data = await res.json();
      if (data.success || res.ok) {
        alert("🔄 Emprunt prolongé avec succès !");
        loadBorrowings();
      } else {
        alert(data.error || "Renouvellement impossible");
      }
    } catch {
      alert("Erreur lors du renouvellement");
    }
  };

  // ── Sauvegarde note ─────────────────────────────────────────────────────
  const handleSaveNote = async () => {
    if (!noteModal) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/borrowings/${noteModal.borrowingId}/note`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes: noteText }),
        },
      );
      const data = await res.json();
      if (data.success || res.ok) {
        alert("📝 Note enregistrée !");
        setNoteModal(null);
        loadBorrowings(); // ← Recharge pour afficher la note sur la card
      } else {
        alert(data.error || "Erreur lors de la sauvegarde");
      }
    } catch {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Soumission avis ─────────────────────────────────────────────────────
  const handleSubmitReview = async () => {
    if (!reviewModal) return;
    if (reviewRating === 0) {
      alert("Veuillez sélectionner une note");
      return;
    }
    if (!reviewTitle.trim()) {
      alert("Le titre est requis");
      return;
    }
    if (!reviewContent.trim()) {
      alert("Le contenu est requis");
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = reviewTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // ← Route correcte : POST /api/borrowings/:borrowingId/review
      const res = await fetch(
        `http://localhost:5000/api/borrowings/${reviewModal.borrowingId}/review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: reviewRating,
            title: reviewTitle,
            content: reviewContent,
            tags: tagsArray,
          }),
        },
      );
      const data = await res.json();
      if (data.success || res.ok) {
        alert("⭐ Avis soumis ! Il sera visible après modération.");
        setReviewModal(null);
        setReviewRating(0);
        setReviewTitle("");
        setReviewContent("");
        setReviewTags("");
      } else {
        alert(data.error || "Erreur lors de la soumission");
      }
    } catch {
      alert("Erreur lors de la soumission de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Ouverture modal avis ────────────────────────────────────────────────
  const openReviewModal = (b) => {
    setReviewModal({ borrowingId: b._id, bookTitle: b.book?.title });
    setReviewRating(0);
    setReviewTitle("");
    setReviewContent("");
    setReviewTags("");
  };

  // ── Calcul aperçu pénalité (côté client uniquement, pour l'UX) ──────────
  const getPreviewPenalty = () => {
    if (!returnDate || !returnModal?.dueDate) return null;
    const due = new Date(returnModal.dueDate);
    const ret = new Date(returnDate);
    const days = Math.ceil((ret - due) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">
        Chargement de vos emprunts...
      </div>
    );

  // ── Calcul des totaux depuis les données MongoDB ─────────────────────────
  // On lit penalty.amount directement depuis le document MongoDB
  const penalties = borrowings.reduce(
    (sum, b) => sum + (b.penalty?.amount || 0),
    0,
  );

  const activeAndPending = borrowings.filter(
    (b) => b.status === "active" || b.status === "pending",
  );
  const overdueBorrowings = borrowings.filter((b) => b.status === "overdue");
  const previewDays = getPreviewPenalty();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <span>📋</span> Mes emprunts
        </h1>

        {/* ── Résumé ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Emprunts en cours
            </p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {activeAndPending.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              En retard
            </p>
            <p className="text-4xl font-bold text-red-500 mt-2">
              {overdueBorrowings.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Pénalités totales
            </p>
            <p className="text-4xl font-bold text-amber-600 mt-2">
              {penalties}€
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Liste d'attente
            </p>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {waitingList.length}
            </p>
          </div>
        </div>

        {/* ── Liste d'attente ── */}
        {waitingList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">⏳ Ma liste d'attente</h2>
            <div className="space-y-3">
              {waitingList.map((entry) => (
                <div
                  key={entry._id}
                  className="bg-white rounded-xl shadow-sm p-4 border border-purple-100 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {entry.book?.title || "Titre inconnu"}
                    </p>
                    <p className="text-sm text-gray-500">
                      par {entry.book?.author || "Auteur inconnu"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      entry.status === "notified"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {entry.status === "notified"
                      ? "📬 Disponible ! (48h)"
                      : `Position #${entry.position}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Liste des emprunts ── */}
        {borrowings.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-200 text-center">
            <p className="text-gray-400 text-lg">
              Vous n'avez aucun emprunt pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {borrowings.map((b) => {
              const dueDate = new Date(b.dueDate);
              const isOverdue = new Date() > dueDate && b.status !== "returned";
              const daysLeft = Math.ceil(
                (dueDate - new Date()) / (1000 * 60 * 60 * 24),
              );
              const daysOverdue = Math.abs(daysLeft);

              // ← Pénalité lue directement depuis MongoDB (stockée au retour)
              const penaltyAmount = b.penalty?.amount || 0;

              return (
                <div
                  key={b._id}
                  className={`bg-white rounded-xl shadow-sm p-6 border flex flex-col md:flex-row justify-between items-start gap-4 ${
                    isOverdue ? "border-red-200" : "border-gray-100"
                  }`}
                >
                  {/* ── Infos emprunt ── */}
                  <div className="flex-1 w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {b.book?.title || "Titre inconnu"}
                        </h3>
                        <p className="text-gray-500">
                          par {b.book?.author || "Auteur inconnu"}
                        </p>
                      </div>
                      <span
                        className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
                          b.status === "returned"
                            ? "bg-green-100 text-green-700"
                            : isOverdue
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {b.status === "returned"
                          ? "Retourné"
                          : isOverdue
                            ? "En retard"
                            : "Actif"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      <p>
                        <span className="text-gray-400">Date d'emprunt :</span>{" "}
                        {new Date(b.borrowDate).toLocaleDateString()}
                      </p>
                      <p
                        className={`font-semibold ${
                          b.status === "returned"
                            ? "text-green-600"
                            : isOverdue
                              ? "text-red-600"
                              : "text-green-600"
                        }`}
                      >
                        {b.status === "returned"
                          ? `✅ Retourné le ${new Date(
                              b.returnDate,
                            ).toLocaleDateString()}`
                          : isOverdue
                            ? `❌ EN RETARD de ${daysOverdue} jour(s)`
                            : `📅 Retour le : ${dueDate.toLocaleDateString()} (${daysLeft} j)`}
                      </p>

                      {/* ← Pénalité live pour les emprunts en retard non retournés */}
                      {isOverdue && b.status !== "returned" && (
                        <p className="text-red-600 font-semibold col-span-2">
                          💸 Pénalité estimée : {daysOverdue}€ (1€/jour)
                        </p>
                      )}

                      {/* ← Pénalité stockée en MongoDB pour les livres retournés */}
                      {b.status === "returned" && penaltyAmount > 0 && (
                        <p className="text-amber-600 col-span-2">
                          💳 Pénalité : {penaltyAmount}€{" "}
                          {b.penalty?.paid ? "✅ Payée" : "❗ Non payée"}
                        </p>
                      )}

                      {b.renewalCount > 0 && (
                        <p className="text-gray-500">
                          🔄 Prolongé {b.renewalCount} fois
                        </p>
                      )}

                      {/* ← Note affichée depuis MongoDB */}
                      {b.notes && (
                        <p className="text-gray-500 col-span-2 italic">
                          📝 {b.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── Boutons d'action ── */}
                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                    {b.status !== "returned" && (
                      <>
                        <button
                          onClick={() => {
                            setReturnModal({
                              borrowingId: b._id,
                              bookTitle: b.book?.title,
                              dueDate: b.dueDate,
                            });
                            setReturnDate("");
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          Retourner
                        </button>
                        {!isOverdue && (b.renewalCount || 0) < 2 && (
                          <button
                            onClick={() => handleRenew(b._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                          >
                            Prolonger
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setNoteModal({ borrowingId: b._id });
                            setNoteText(b.notes || "");
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                        >
                          📝 Note
                        </button>
                      </>
                    )}

                    {b.status === "returned" && (
                      <button
                        onClick={() => openReviewModal(b)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium"
                      >
                        ⭐ Donner un avis
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          MODAL : Retour du livre
      ══════════════════════════════════════════ */}
      {returnModal && (
        <Modal
          title="📤 Retourner le livre"
          onClose={() => {
            setReturnModal(null);
            setReturnDate("");
          }}
        >
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">« {returnModal.bookTitle} »</span>
          </p>

          <div className="mb-2">
            <label className="text-sm text-gray-500 block mb-1">
              Date de retour{" "}
              <span className="text-gray-400">
                (laisser vide = aujourd'hui)
              </span>
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Aperçu pénalité en temps réel */}
          {returnDate &&
            (previewDays > 0 ? (
              <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">
                ⚠️ Retard de {previewDays} jour(s) — pénalité estimée :{" "}
                <strong>{previewDays}€</strong>
              </p>
            ) : (
              <p className="text-green-600 text-sm mt-2 bg-green-50 p-2 rounded-lg">
                ✅ Retour dans les délais — aucune pénalité
              </p>
            ))}

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => {
                setReturnModal(null);
                setReturnDate("");
              }}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleReturn}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Traitement..." : "Confirmer le retour"}
            </button>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════
          MODAL : Note personnelle
      ══════════════════════════════════════════ */}
      {noteModal && (
        <Modal title="📝 Ajouter une note" onClose={() => setNoteModal(null)}>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Vos remarques sur cet emprunt..."
            maxLength={500}
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-gray-400 mb-4 text-right">
            {noteText.length}/500
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setNoteModal(null)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveNote}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════
          MODAL : Avis lecteur
      ══════════════════════════════════════════ */}
      {reviewModal && (
        <Modal
          title={`⭐ Votre avis sur "${reviewModal.bookTitle}"`}
          onClose={() => setReviewModal(null)}
        >
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Note *</p>
            <StarRating value={reviewRating} onChange={setReviewRating} />
          </div>

          <div className="mb-3">
            <label className="text-sm text-gray-500 block mb-1">Titre *</label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Ex : Un chef-d'œuvre incontournable"
              maxLength={100}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {reviewTitle.length}/100
            </p>
          </div>

          <div className="mb-3">
            <label className="text-sm text-gray-500 block mb-1">
              Votre avis *
            </label>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Partagez votre expérience de lecture..."
              maxLength={1000}
              rows={4}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-xs text-gray-400 text-right">
              {reviewContent.length}/1000
            </p>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">
              Tags{" "}
              <span className="text-gray-400">
                (optionnel, séparés par des virgules)
              </span>
            </label>
            <input
              type="text"
              value={reviewTags}
              onChange={(e) => setReviewTags(e.target.value)}
              placeholder="Ex : roman, aventure, jeunesse"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {reviewTags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {reviewTags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mb-4 bg-gray-50 p-2 rounded-lg">
            ℹ️ Votre avis sera visible après validation par un libraire.
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setReviewModal(null)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={
                submitting ||
                reviewRating === 0 ||
                !reviewTitle.trim() ||
                !reviewContent.trim()
              }
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              {submitting ? "Envoi..." : "Soumettre"}
            </button>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════
          MODAL : Pénalité de retard au retour
      ══════════════════════════════════════════ */}
      {penaltyModal && (
        <Modal
          title="💸 Pénalité de retard"
          onClose={() => setPenaltyModal(null)}
        >
          <div className="text-center py-4">
            <p className="text-5xl font-bold text-red-500 mb-2">
              {penaltyModal.penalty.amount}€
            </p>
            <p className="text-gray-600 mb-1">
              à régler pour « {penaltyModal.bookTitle} »
            </p>
            <p className="text-sm text-gray-400">
              Merci de vous rapprocher du libraire pour régulariser votre
              situation.
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setPenaltyModal(null)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Compris
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyBorrowings;
