import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { BookService } from "../../services/book.service";
import { AuthService } from "../../services/auth.service";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-book-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div *ngIf="loading" class="text-center py-12">
        <p class="text-gray-600">Chargement du livre...</p>
      </div>

      <div *ngIf="!loading && book" class="fade-in">
        <a
          routerLink="/books"
          class="text-blue-600 hover:text-blue-700 mb-6 inline-block"
        >
          ← Retour aux livres
        </a>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Book Cover -->
          <div class="md:col-span-1">
            <div
              class="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-6"
            >
              <span class="text-6xl">📖</span>
            </div>
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <p class="text-sm text-gray-600 mb-2">Disponibilité</p>
              <p class="text-2xl font-bold text-green-600 mb-4">
                {{ book.availableCopies }}/{{ book.totalCopies }}
              </p>

              <button
                *ngIf="currentUser$ | async"
                [disabled]="book.availableCopies === 0 || loading"
                (click)="borrowBook()"
                class="btn-primary w-full mb-2"
              >
                Emprunter
              </button>

              <button
                *ngIf="!(currentUser$ | async)"
                routerLink="/login"
                class="btn-primary w-full mb-2"
              >
                Se connecter pour emprunter
              </button>

              <button
                *ngIf="book.availableCopies === 0"
                (click)="joinWaitingList()"
                class="btn-secondary w-full"
              >
                Rejoindre la liste d'attente
              </button>
            </div>
          </div>

          <!-- Book Info -->
          <div class="md:col-span-2">
            <h1 class="text-4xl font-bold mb-2">{{ book.title }}</h1>
            <p class="text-xl text-gray-600 mb-6">par {{ book.author }}</p>

            <div class="bg-blue-50 rounded-lg p-4 mb-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Genres</p>
                  <div
                    *ngIf="book.genres && book.genres.length > 0"
                    class="flex flex-wrap gap-2 mt-1"
                  >
                    <span
                      *ngFor="let genre of book.genres"
                      class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {{ genre }}
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-sm text-gray-600">ISBN</p>
                  <p class="font-medium">{{ book.isbn }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Date de publication</p>
                  <p class="font-medium">
                    {{ book.publishedDate | date: "dd/MM/yyyy" }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Ajouté le</p>
                  <p class="font-medium">
                    {{ book.createdAt | date: "dd/MM/yyyy" }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-2xl font-bold mb-4">À propos du livre</h2>
              <p class="text-gray-700 leading-relaxed">
                {{ book.description }}
              </p>
            </div>

            <!-- Reviews -->
            <div>
              <h2 class="text-2xl font-bold mb-4">
                Avis ({{ reviews.length }})
              </h2>

              <div
                *ngIf="currentUser$ | async"
                class="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <h3 class="font-bold mb-4">Laisser un avis</h3>
                <form
                  [formGroup]="reviewForm"
                  (ngSubmit)="submitReview()"
                  class="space-y-4"
                >
                  <div>
                    <label class="block text-sm font-medium mb-2"
                      >Note (1-5)</label
                    >
                    <select
                      formControlName="rating"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Sélectionner une note</option>
                      <option value="1">⭐ 1 - Mauvais</option>
                      <option value="2">⭐⭐ 2 - Passable</option>
                      <option value="3">⭐⭐⭐ 3 - Bon</option>
                      <option value="4">⭐⭐⭐⭐ 4 - Très bon</option>
                      <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2"
                      >Titre de l'avis</label
                    >
                    <input
                      type="text"
                      formControlName="title"
                      placeholder="Ex: Un excellent livre"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2"
                      >Votre avis</label
                    >
                    <textarea
                      formControlName="content"
                      placeholder="Partagez votre avis..."
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows="4"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2"
                      >Tags (séparés par des virgules)</label
                    >
                    <input
                      type="text"
                      formControlName="tags"
                      placeholder="Ex: fiction, aventure"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    [disabled]="reviewForm.invalid || reviewLoading"
                    class="btn-primary"
                  >
                    {{ reviewLoading ? 'Envoi...' : 'Publier l'avis' }}
                  </button>
                </form>
              </div>

              <div *ngIf="reviews.length > 0" class="space-y-4">
                <div
                  *ngFor="let review of reviews"
                  class="bg-white rounded-lg shadow-md p-4"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-medium">{{ review.title }}</p>
                      <p class="text-sm text-gray-600">
                        par {{ review.user?.firstName }}
                        {{ review.user?.lastName }}
                      </p>
                    </div>
                    <p class="text-sm text-gray-500">
                      {{ review.createdAt | date: "dd/MM/yyyy" }}
                    </p>
                  </div>
                  <p class="text-yellow-500 mb-2">
                    {{ getRating(review.rating) }}
                  </p>
                  <p class="text-gray-700 mb-3">{{ review.content }}</p>
                  <div
                    *ngIf="review.tags && review.tags.length > 0"
                    class="flex flex-wrap gap-2"
                  >
                    <span
                      *ngFor="let tag of review.tags"
                      class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <div *ngIf="reviews.length === 0" class="text-center py-8">
                <p class="text-gray-600">
                  Aucun avis pour le moment. Soyez le premier à donner votre
                  avis !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !book" class="text-center py-12">
        <p class="text-gray-600">Livre non trouvé</p>
      </div>
    </div>
  `,
  styles: [],
})
export class BookDetailComponent implements OnInit {
  book: any;
  reviews: any[] = [];
  loading = true;
  reviewLoading = false;
  reviewForm: FormGroup;
  currentUser$ = this.authService.user$;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.reviewForm = this.fb.group({
      rating: ["", Validators.required],
      title: ["", [Validators.required, Validators.minLength(3)]],
      content: ["", [Validators.required, Validators.minLength(5)]],
      tags: [""],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.loadBook(id);
    }
  }

  loadBook(id: string): void {
    this.bookService.getBook(id).subscribe({
      next: (response) => {
        this.book = response.data || response;
        this.loadReviews(id);
        this.loading = false;
      },
      error: (error) => {
        console.error("Erreur au chargement du livre", error);
        this.loading = false;
      },
    });
  }

  loadReviews(bookId: string): void {
    this.bookService.getBookReviews(bookId).subscribe({
      next: (response) => {
        this.reviews = response.data || [];
      },
      error: (error) => {
        console.error("Erreur au chargement des avis", error);
      },
    });
  }

  borrowBook(): void {
    if (!this.book) return;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    this.bookService
      .borrowBook(this.book._id, dueDate.toISOString())
      .subscribe({
        next: (response) => {
          if (response.success) {
            alert("Livre emprunté avec succès !");
            const id = this.route.snapshot.paramMap.get("id");
            if (id) this.loadBook(id);
          }
        },
        error: (error) => {
          console.error("Erreur lors de l'emprunt", error);
        },
      });
  }

  joinWaitingList(): void {
    if (!this.book) return;
    this.bookService.joinWaitingList(this.book._id).subscribe({
      next: (response) => {
        alert("Vous avez rejoint la liste d'attente");
      },
      error: (error) => {
        console.error("Erreur", error);
      },
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.book) return;

    this.reviewLoading = true;
    const { rating, title, content, tags } = this.reviewForm.value;
    const tagArray = tags
      ? tags.split(",").map((tag: string) => tag.trim())
      : [];

    this.bookService
      .addReview(this.book._id, rating, title, content, tagArray)
      .subscribe({
        next: (response) => {
          if (response.success) {
            alert("Avis publié avec succès !");
            this.reviewForm.reset();
            const id = this.route.snapshot.paramMap.get("id");
            if (id) this.loadReviews(id);
          }
          this.reviewLoading = false;
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi de l'avis", error);
          this.reviewLoading = false;
        },
      });
  }

  getRating(rating: number): string {
    return "⭐".repeat(rating);
  }
}
