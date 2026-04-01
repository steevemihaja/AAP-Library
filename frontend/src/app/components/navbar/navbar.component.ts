import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav
      class="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg sticky top-0 z-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a
            routerLink="/"
            class="flex items-center space-x-3 hover:scale-105 transition-transform duration-200"
          >
            <div
              class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <span class="text-2xl">📚</span>
            </div>
            <span class="text-xl font-bold text-white">
              Bibliothèque En Ligne
            </span>
          </a>

          <!-- Menu -->
          <div class="flex items-center space-x-8">
            <a
              routerLink="/"
              class="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 font-medium flex items-center space-x-1"
            >
              <span>🏠</span>
              <span>Accueil</span>
            </a>
            <a
              routerLink="/books"
              class="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 font-medium flex items-center space-x-1"
            >
              <span>📖</span>
              <span>Livres</span>
            </a>

            <!-- If authenticated -->
            <ng-container *ngIf="currentUser$ | async as user">
              <a
                routerLink="/my-borrowings"
                class="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 font-medium flex items-center space-x-1"
              >
                <span>📚</span>
                <span>Mes emprunts</span>
              </a>

              <!-- Admin menu -->
              <ng-container *ngIf="isAdmin$ | async">
                <a
                  routerLink="/books/add"
                  class="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg flex items-center space-x-1"
                >
                  <span>➕</span>
                  <span>Ajouter un livre</span>
                </a>
              </ng-container>

              <!-- User profile -->
              <div class="flex items-center space-x-3 ml-4">
                <a
                  routerLink="/dashboard"
                  class="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                >
                  <div
                    class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <span class="text-white font-semibold">
                      {{ user.firstName.charAt(0)
                      }}{{ user.lastName.charAt(0) }}
                    </span>
                  </div>
                  <span class="text-white font-medium">{{
                    user.firstName
                  }}</span>
                </a>
                <button
                  (click)="logout()"
                  class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Déconnexion
                </button>
              </div>
            </ng-container>

            <!-- If not authenticated -->
            <ng-container *ngIf="!(currentUser$ | async)">
              <a
                routerLink="/login"
                class="text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                Connexion
              </a>
              <a
                routerLink="/register"
                class="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
              >
                Inscription
              </a>
            </ng-container>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [],
})
export class NavbarComponent implements OnInit {
  currentUser$ = this.authService.user$;
  isAdmin$ = this.authService.user$.pipe(
    map(
      (user) => !!user && (user.role === "admin" || user.role === "librarian"),
    ),
  );

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // already initialized in field declaration
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
