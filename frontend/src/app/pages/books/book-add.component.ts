import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { BookService } from "../../services/book.service";

@Component({
  selector: "app-book-add",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="mb-8">
        <a routerLink="/books" class="text-blue-600 hover:text-blue-700"
          >← Retour aux livres</a
        >
        <h1 class="text-4xl font-bold mt-4">Ajouter un nouveau livre</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Titre *</label
              >
              <input
                type="text"
                formControlName="title"
                placeholder="Titre du livre"
                class="input-field"
              />
              <p
                *ngIf="form.get('title')?.hasError('required')"
                class="error-message"
              >
                Le titre est requis
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Auteur *</label
              >
              <input
                type="text"
                formControlName="author"
                placeholder="Nom de l'auteur"
                class="input-field"
              />
              <p
                *ngIf="form.get('author')?.hasError('required')"
                class="error-message"
              >
                L'auteur est requis
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >ISBN *</label
              >
              <input
                type="text"
                formControlName="isbn"
                placeholder="ISBN-13"
                class="input-field"
              />
              <p
                *ngIf="form.get('isbn')?.hasError('required')"
                class="error-message"
              >
                L'ISBN est requis
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Genre *</label
              >
              <select formControlName="genres" class="input-field">
                <option value="">Sélectionner un genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Poetry">Poetry</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Adventure">Adventure</option>
                <option value="Children">Children</option>
                <option value="Young Adult">Young Adult</option>
                <option value="Classic">Classic</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Religion">Religion</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>
                <option value="Travel">Travel</option>
                <option value="Cooking">Cooking</option>
                <option value="Sports">Sports</option>
                <option value="Business">Business</option>
                <option value="Economics">Economics</option>
              </select>
              <p
                *ngIf="form.get('genres')?.hasError('required')"
                class="error-message"
              >
                Le genre est requis
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Nombre total de copies *</label
              >
              <input
                type="number"
                formControlName="totalCopies"
                placeholder="10"
                class="input-field"
              />
              <p
                *ngIf="form.get('totalCopies')?.hasError('required')"
                class="error-message"
              >
                Le nombre de copies est requis
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Date de publication</label
              >
              <input
                type="date"
                formControlName="publishedDate"
                class="input-field"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Description *</label
            >
            <textarea
              formControlName="description"
              placeholder="Décrivez le livre..."
              rows="6"
              class="input-field"
            ></textarea>
            <p
              *ngIf="form.get('description')?.hasError('required')"
              class="error-message"
            >
              La description est requise
            </p>
          </div>

          <div
            *ngIf="error"
            class="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p class="text-red-600">{{ error }}</p>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              [disabled]="loading || form.invalid"
              class="btn-primary flex-1"
            >
              {{ loading ? "Ajout en cours..." : "Ajouter le livre" }}
            </button>
            <a
              routerLink="/books"
              class="btn-secondary flex-1 text-center block"
            >
              Annuler
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class BookAddComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = "";

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      title: ["", Validators.required],
      author: ["", Validators.required],
      isbn: ["", Validators.required],
      genres: ["", Validators.required],
      totalCopies: [1, [Validators.required, Validators.min(1)]],
      publishedDate: [""],
      description: ["", Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = "";

    const formData = { ...this.form.value };
    // Convert genres single value to array
    if (formData.genres) {
      formData.genres = [formData.genres];
    }

    this.bookService.createBook(formData).subscribe({
      next: (response) => {
        if (response.success) {
          const bookId = response.data?._id || response.book?._id;
          if (bookId) {
            this.router.navigate(["/books", bookId]);
          } else {
            this.router.navigate(["/books"]);
          }
        } else {
          this.error = response.error || "Erreur lors de l'ajout du livre";
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.error || "Erreur lors de l'ajout du livre";
        this.loading = false;
      },
    });
  }
}
