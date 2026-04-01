import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BookService } from "../../services/book.service";

@Component({
  selector: "app-book-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Découvrez nos livres</h1>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <form
          [formGroup]="filterForm"
          class="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Rechercher</label
            >
            <input
              type="text"
              formControlName="search"
              placeholder="Titre, auteur..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Genre</label
            >
            <select
              formControlName="genre"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tous les genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-fiction">Non-fiction</option>
              <option value="Science">Science</option>
              <option value="Histoire">Histoire</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <button (click)="applyFilters()" class="btn-primary flex-1">
              Rechercher
            </button>
            <button
              (click)="resetFilters()"
              type="button"
              class="btn-secondary"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-12">
        <p class="text-gray-600">Chargement des livres...</p>
      </div>

      <!-- Books Grid -->
      <div
        *ngIf="!loading && books.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div
          *ngFor="let book of books"
          class="card overflow-hidden hover:shadow-xl transition"
        >
          <div
            class="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
          >
            <span class="text-4xl">📖</span>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2 truncate">{{ book.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ book.author }}</p>
            <div class="flex justify-between items-center mb-4">
              <span
                *ngIf="book.genres && book.genres[0]"
                class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >{{ book.genres[0] }}</span
              >
              <span class="text-sm font-medium"
                >{{ book.availableCopies }}/{{ book.totalCopies }}</span
              >
            </div>
            <a
              [routerLink]="['/books', book._id]"
              class="btn-primary w-full text-center block"
            >
              Voir détails
            </a>
          </div>
        </div>
      </div>

      <!-- No results -->
      <div *ngIf="!loading && books.length === 0" class="text-center py-12">
        <p class="text-gray-600">Aucun livre trouvé</p>
      </div>

      <!-- Pagination -->
      <div
        *ngIf="!loading && books.length > 0"
        class="flex justify-center items-center gap-4 mt-8"
      >
        <button
          (click)="previousPage()"
          [disabled]="currentPage === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Précédent
        </button>
        <span class="text-gray-600"
          >Page {{ currentPage }} / {{ totalPages }}</span
        >
        <button
          (click)="nextPage()"
          [disabled]="currentPage >= totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  loading = false;
  filterForm: FormGroup;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      search: [""],
      genre: [""],
    });
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    const params = {
      page: this.currentPage,
      limit: 12,
      search: this.filterForm.value.search,
      genre: this.filterForm.value.genre,
    };

    this.bookService.getBooks(params).subscribe({
      next: (response) => {
        this.books = response.data;
        this.currentPage = response.pagination.currentPage;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des livres", error);
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadBooks();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBooks();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks();
    }
  }
}
