import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4"
    >
      <div class="max-w-md w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <a
            routerLink="/"
            class="inline-flex items-center space-x-3 mb-6 hover:scale-105 transition-transform duration-200"
          >
            <div
              class="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center"
            >
              <span class="text-3xl">📚</span>
            </div>
            <span class="text-2xl font-bold text-emerald-600"
              >Bibliothèque En Ligne</span
            >
          </a>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue de Retour !
          </h2>
          <p class="text-gray-600">
            Connectez-vous pour continuer votre aventure littéraire
          </p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <!-- Error Message -->
          <div
            *ngIf="error"
            class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in"
          >
            <div class="flex items-center space-x-2">
              <span class="text-red-500">⚠️</span>
              <p class="text-red-700 text-sm font-medium">{{ error }}</p>
            </div>
          </div>

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Adresse Email
              </label>
              <div class="relative">
                <div
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500"
                >
                  <svg
                    class="w-5 h-5"
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
                <input
                  type="email"
                  formControlName="email"
                  placeholder="votre.email@exemple.com"
                  class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div
                *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
                class="mt-1 text-sm text-red-600"
              >
                Email invalide
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Mot de Passe
              </label>
              <div class="relative">
                <div
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="password"
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div
                *ngIf="
                  form.get('password')?.invalid && form.get('password')?.touched
                "
                class="mt-1 text-sm text-red-600"
              >
                Mot de passe requis (minimum 6 caractères)
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loading || form.invalid"
              class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span
                *ngIf="!loading"
                class="flex items-center justify-center space-x-2"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  ></path>
                </svg>
                <span>Se Connecter</span>
              </span>
              <span
                *ngIf="loading"
                class="flex items-center justify-center space-x-2"
              >
                <svg
                  class="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Connexion en cours...</span>
              </span>
            </button>
          </form>

          <!-- Register Link -->
          <div class="mt-8 text-center">
            <p class="text-gray-600">
              Nouveau sur notre plateforme ?
              <a
                routerLink="/register"
                class="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors duration-200"
              >
                Créer un compte
              </a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-sm text-gray-500">
            En vous connectant, vous acceptez nos
            <a href="#" class="text-emerald-600 hover:underline"
              >conditions d'utilisation</a
            >
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = "";

    this.authService
      .login(this.form.value.email, this.form.value.password)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(["/dashboard"]);
          } else {
            this.error = "Connexion échouée";
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.error || "Erreur de connexion au serveur";
          this.loading = false;
        },
      });
  }
}
