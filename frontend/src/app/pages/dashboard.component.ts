import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { map } from "rxjs/operators";
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
        <!-- Welcome Header -->
        <div class="mb-8">
          <div
            class="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
          >
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-4xl font-bold text-gray-900 mb-2">
                  Bienvenue sur votre tableau de bord
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

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Current Borrowings Card -->
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

          <!-- Total Books Read Card -->
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

          <!-- Waiting Lists Card -->
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

        <!-- User Info Section -->
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
                  class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Prénom</p>
                  <p class="font-bold text-lg text-gray-900">
                    {{ user.firstName }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Nom</p>
                  <p class="font-bold text-lg text-gray-900">
                    {{ user.lastName }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    ></path>
                  </svg>
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
                  class="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
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

            <div class="bg-gray-50 rounded-2xl p-4" *ngIf="user.phone">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Téléphone</p>
                  <p class="font-bold text-lg text-gray-900">
                    {{ user.phone || "-" }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-2xl p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-cyan-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Membre depuis</p>
                  <p class="font-bold text-lg text-gray-900">
                    {{ user.createdAt | date: "dd/MM/yyyy" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
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
                Découvrez des milliers de livres dans tous les genres et
                domaines
              </p>
              <div
                class="mt-4 inline-flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors duration-200"
              >
                <span>Parcourir</span>
                <svg
                  class="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
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
                Gérez vos emprunts actifs, consultez l'historique et les dates
                de retour
              </p>
              <div
                class="mt-4 inline-flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors duration-200"
              >
                <span>Voir mes emprunts</span>
                <svg
                  class="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
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
                Enrichissez notre collection en ajoutant de nouveaux ouvrages
              </p>
              <div
                class="mt-4 inline-flex items-center text-white font-semibold"
              >
                <span>Ajouter</span>
                <svg
                  class="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  currentUser$ = this.authService.user$;
  isAdmin$ = this.authService.user$.pipe(
    map((user) => user?.role === "admin" || user?.role === "librarian"),
  );
  currentBorrowings = 0;
  totalBooksRead = 0;
  waitingCount = 0;

  constructor(
    private authService: AuthService,
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.bookService.getUserBorrowings().subscribe({
      next: (response: any) => {
        const borrowings = response.borrowings || [];
        this.currentBorrowings = borrowings.filter(
          (b: any) => b.status === "active",
        ).length;
        this.totalBooksRead = borrowings.filter(
          (b: any) => b.status === "returned",
        ).length;
      },
      error: (error: any) => {
        console.error("Erreur au chargement des statistiques", error);
      },
    });

    this.bookService.getUserWaitingLists().subscribe({
      next: (response: any) => {
        this.waitingCount = (response.waitingLists || []).length;
      },
      error: (error: any) => {
        console.error("Erreur", error);
      },
    });
  }

  getRoleName(role: string): string {
    const roles: { [key: string]: string } = {
      admin: "Administrateur",
      librarian: "Bibliothécaire",
      user: "Utilisateur",
    };
    return roles[role] || role;
  }
}
