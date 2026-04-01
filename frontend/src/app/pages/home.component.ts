import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <div
        class="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative max-w-6xl mx-auto px-4 py-24 lg:py-32">
          <div class="text-center">
            <div
              class="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-8 backdrop-blur-sm"
            >
              <span class="text-5xl">📚</span>
            </div>
            <h1 class="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Découvrez l'Univers des Livres
            </h1>
            <p
              class="text-xl lg:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed"
            >
              Explorez notre collection exceptionnelle, empruntez vos ouvrages
              préférés et rejoignez une communauté de passionnés de lecture.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                routerLink="/books"
                class="bg-white text-emerald-600 px-8 py-4 rounded-xl hover:bg-emerald-50 font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>🔍</span>
                <span>Explorer la Collection</span>
              </a>
              <a
                routerLink="/register"
                class="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-emerald-600 font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Commencer l'Aventure
              </a>
            </div>
          </div>
        </div>
        <!-- Decorative elements -->
        <div
          class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"
        ></div>
        <div
          class="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"
        ></div>
      </div>

      <!-- Features Section -->
      <div class="max-w-6xl mx-auto px-4 py-24">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Pourquoi Nous Choisir ?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les avantages d'une bibliothèque moderne et accessible à
            tous.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div
              class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 mx-auto"
            >
              <span class="text-3xl">🔍</span>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-center text-gray-800">
              Recherche Intelligente
            </h3>
            <p class="text-gray-600 text-center leading-relaxed">
              Trouvez instantanément les livres que vous cherchez grâce à notre
              système de recherche avancé et nos filtres personnalisés.
            </p>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div
              class="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 mx-auto"
            >
              <span class="text-3xl">📚</span>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-center text-gray-800">
              Emprunt Simplifié
            </h3>
            <p class="text-gray-600 text-center leading-relaxed">
              Réservez et empruntez vos livres en quelques clics. Suivez vos
              emprunts et recevez des rappels automatiques.
            </p>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div
              class="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6 mx-auto"
            >
              <span class="text-3xl">⭐</span>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-center text-gray-800">
              Communauté Active
            </h3>
            <p class="text-gray-600 text-center leading-relaxed">
              Partagez vos avis, découvrez les recommandations de la communauté
              et participez à des clubs de lecture virtuels.
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 py-24">
        <div class="max-w-6xl mx-auto px-4">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div
                class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-3xl">📖</span>
              </div>
              <p class="text-4xl font-bold text-emerald-600 mb-2">10K+</p>
              <p class="text-gray-600 font-medium">Livres Disponibles</p>
            </div>
            <div class="text-center">
              <div
                class="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-3xl">👥</span>
              </div>
              <p class="text-4xl font-bold text-teal-600 mb-2">5K+</p>
              <p class="text-gray-600 font-medium">Lecteurs Actifs</p>
            </div>
            <div class="text-center">
              <div
                class="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-3xl">📚</span>
              </div>
              <p class="text-4xl font-bold text-cyan-600 mb-2">50K+</p>
              <p class="text-gray-600 font-medium">Emprunts Réalisés</p>
            </div>
            <div class="text-center">
              <div
                class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-3xl">⭐</span>
              </div>
              <p class="text-4xl font-bold text-emerald-600 mb-2">4.8/5</p>
              <p class="text-gray-600 font-medium">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 class="text-4xl font-bold mb-6 text-gray-800">
          Prêt à Plonger dans l'Univers des Livres ?
        </h2>
        <p
          class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Rejoignez notre communauté de lecteurs passionnés et découvrez un
          monde d'histoires extraordinaires.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            routerLink="/register"
            class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Créer Mon Compte Gratuit
          </a>
          <a
            routerLink="/login"
            class="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-xl hover:bg-emerald-500 hover:text-white font-bold transition-all duration-300"
          >
            Se Connecter
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class HomeComponent {}
