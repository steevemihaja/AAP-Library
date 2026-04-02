import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { map, Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";
import { BookService } from "../services/book.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"
    >
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="mb-8">
          <div
            class="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
          >
            <div class="flex items-center justify-between">
              <div *ngIf="currentUser$ | async as user">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">
                  Bienvenue, {{ user.firstName }} !
                </h1>
                <p class="text-gray-600 text-lg">
                  Gérez vos emprunts et explorez notre collection littéraire
                </p>
              </div>
              <div class="hidden md:block">
                <div
                  class="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center"
                >
                  <span class="text-4xl">📚</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium mb-2">
                  Emprunts Actifs
                </p>
                <p class="text-4xl font-bold text-emerald-600">
                  {{ currentBorrowings }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  Livres en cours de lecture
                </p>
              </div>
              <div
                class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center"
              >
                <span class="text-3xl">📖</span>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium mb-2">
                  Livres Terminés
                </p>
                <p class="text-4xl font-bold text-teal-600">
                  {{ totalBooksRead }}
                </p>
                <p class="text-sm text-gray-500 mt-1">Lectures accomplies</p>
              </div>
              <div
                class="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center"
              >
                <span class="text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium mb-2">
                  Listes d'Attente
                </p>
                <p class="text-4xl font-bold text-cyan-600">
                  {{ waitingCount }}
                </p>
                <p class="text-sm text-gray-500 mt-1">Réservations actives</p>
              </div>
              <div
                class="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center"
              >
                <span class="text-3xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Mes Informations</h2>
            <button
              class="text-emerald-600 hover:text-emerald-700 font-medium text-sm hover:underline transition-colors duration-200"
            >
              Modifier le profil
            </button>
          </div>

          <div
            *ngIf="currentUser$ | async as user"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"
                >
                  👤
                </div>
                <div>
                  <p class="text-sm text-gray-600">Utilisateur</p>
                  <p class="font-bold text-lg text-gray-900">
                    {{ user.firstName }} {{ user.lastName }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600"
                >
                  📧
                </div>
                <div>
                  <p class="text-sm text-gray-600">Email</p>
                  <p class="font-bold text-lg text-gray-900">
                    {{ user.email }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600"
                >
                  🛡️
                </div>
                <div>
                  <p class="text-sm text-gray-600">Rôle</p>
                  <span
                    [ngClass]="{
                      'bg-emerald-100 text-emerald-700': user.role === 'admin',
                      'bg-purple-100 text-purple-700':
                        user.role === 'librarian',
                      'bg-gray-100 text-gray-700': user.role === 'user',
                    }"
                    class="px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {{ getRoleName(user.role) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            routerLink="/books"
            class="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
          >
            <div class="text-center">
              <div
                class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors duration-300"
              >
                <span class="text-3xl">🔍</span>
              </div>
              <h3 class="font-bold text-xl mb-3 text-gray-900">
                Explorer la Collection
              </h3>
              <p class="text-gray-600 leading-relaxed">
                Découvrez des milliers de livres dans tous les genres
              </p>
              <div
                class="mt-4 inline-flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors duration-200"
              >
                <span>Parcourir</span>
                <span class="ml-2">→</span>
              </div>
            </div>
          </a>

          <a
            routerLink="/my-borrowings"
            class="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
          >
            <div class="text-center">
              <div
                class="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors duration-300"
              >
                <span class="text-3xl">📋</span>
              </div>
              <h3 class="font-bold text-xl mb-3 text-gray-900">Mes Emprunts</h3>
              <p class="text-gray-600 leading-relaxed">
                Gérez vos emprunts actifs et consultez l'historique
              </p>
              <div
                class="mt-4 inline-flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors duration-200"
              >
                <span>Voir mes emprunts</span>
                <span class="ml-2">→</span>
              </div>
            </div>
          </a>

          <a
            routerLink="/books/add"
            *ngIf="isAdmin$ | async"
            class="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
          >
            <div class="text-center">
              <div
                class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors duration-300"
              >
                <span class="text-3xl">➕</span>
              </div>
              <h3 class="font-bold text-xl mb-3">Ajouter un Livre</h3>
              <p class="text-white/90 leading-relaxed">
                Enrichissez la collection de la bibliothèque
              </p>
              <div
                class="mt-4 inline-flex items-center text-white font-semibold"
              >
                <span>Ajouter</span>
                <span class="ml-2">→</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser$ = this.authService.user$;

  // Définit si l'utilisateur a des droits élevés (Admin ou Bibliothécaire)
  isAdmin$ = this.authService.user$.pipe(
    map((user) => user?.role === "admin" || user?.role === "librarian"),
  );

  currentBorrowings = 0;
  totalBooksRead = 0;
  waitingCount = 0;

  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    // Nettoyage des abonnements pour éviter les fuites de mémoire
    this.subscriptions.unsubscribe();
  }

  loadStats(): void {
    // 1. Récupération des emprunts (Actifs vs Terminés)
    const borrowSub = this.bookService.getUserBorrowings().subscribe({
      next: (res: any) => {
        // Accès aux données (gère les formats response.data ou response direct)
        const data = res.data || res;

        if (Array.isArray(data)) {
          // Emprunts en cours (status 'active' ou 'pending')
          this.currentBorrowings = data.filter(
            (b: any) => b.status === "active" || b.status === "pending",
          ).length;

          // Livres terminés (status 'returned')
          this.totalBooksRead = data.filter(
            (b: any) => b.status === "returned",
          ).length;
        }
      },
      error: (err) => console.error("Erreur stats emprunts:", err),
    });

    // 2. Récupération du nombre d'inscriptions en liste d'attente
    const waitSub = this.bookService.getUserWaitingLists().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.waitingCount = Array.isArray(data) ? data.length : 0;
      },
      error: (err) => console.error("Erreur stats attente:", err),
    });

    this.subscriptions.add(borrowSub);
    this.subscriptions.add(waitSub);
  }

  getRoleName(role?: string): string {
    if (!role) return "Utilisateur";
    const roles: { [key: string]: string } = {
      admin: "Administrateur",
      librarian: "Bibliothécaire",
      user: "Utilisateur",
    };
    return roles[role.toLowerCase()] || role;
  }
}
