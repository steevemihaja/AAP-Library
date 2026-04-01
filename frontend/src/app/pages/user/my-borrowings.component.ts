import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BookService } from "../../services/book.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-my-borrowings",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Mes emprunts</h1>

      <div *ngIf="loading" class="text-center py-12">
        <p class="text-gray-600">Chargement de vos emprunts...</p>
      </div>

      <div *ngIf="!loading && borrowings.length > 0">
        <div class="grid gap-4">
          <div *ngFor="let borrowing of borrowings" class="card p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-1">Livre</p>
                <p class="font-bold">{{ borrowing.book.title }}</p>
                <p class="text-sm text-gray-600">
                  par {{ borrowing.book.author }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">Emprunté le</p>
                <p class="font-bold">
                  {{ borrowing.borrowDate | date: "dd/MM/yyyy" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">À rendre avant</p>
                <p
                  class="font-bold"
                  [ngClass]="
                    isOverdue(borrowing.dueDate)
                      ? 'text-red-600'
                      : 'text-green-600'
                  "
                >
                  {{ borrowing.dueDate | date: "dd/MM/yyyy" }}
                </p>
                <p
                  *ngIf="isOverdue(borrowing.dueDate)"
                  class="text-xs text-red-600"
                >
                  Dépassement !
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">Statut</p>
                <span
                  [ngClass]="{
                    'bg-green-100 text-green-700':
                      borrowing.status === 'active',
                    'bg-blue-100 text-blue-700':
                      borrowing.status === 'returned',
                  }"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ borrowing.status === "active" ? "En cours" : "Rendu" }}
                </span>
              </div>
            </div>
            <div class="mt-4 flex gap-2">
              <a
                [routerLink]="['/books', borrowing.book._id]"
                class="btn-secondary"
              >
                Voir le livre
              </a>
              <button
                *ngIf="borrowing.status === 'active'"
                (click)="returnBook(borrowing._id)"
                [disabled]="returning"
                class="btn-primary"
              >
                {{ returning ? "Retour en cours..." : "Retourner" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="!loading && borrowings.length === 0"
        class="text-center py-12"
      >
        <p class="text-gray-600 mb-4">Vous n'avez aucun emprunt en cours</p>
        <a routerLink="/books" class="btn-primary"> Découvrir nos livres </a>
      </div>

      <!-- My Waiting Lists -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6">List d'attente</h2>

        <div *ngIf="waitingLists.length > 0" class="grid gap-4">
          <div *ngFor="let waiting of waitingLists" class="card p-6">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-bold">{{ waiting.book.title }}</p>
                <p class="text-sm text-gray-600">{{ waiting.book.author }}</p>
                <p class="text-sm text-gray-600 mt-2">
                  Position en attente: <strong>#{{ waiting.position }}</strong>
                </p>
              </div>
              <button
                (click)="leaveWaitingList(waiting.book._id)"
                [disabled]="removing"
                class="btn-danger"
              >
                {{ removing ? "Suppression..." : "Quitter" }}
              </button>
            </div>
          </div>
        </div>

        <div
          *ngIf="waitingLists.length === 0"
          class="text-center py-8 bg-gray-50 rounded-lg"
        >
          <p class="text-gray-600">Vous n'êtes sur aucune liste d'attente</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MyBorrowingsComponent implements OnInit {
  borrowings: any[] = [];
  waitingLists: any[] = [];
  loading = false;
  returning = false;
  removing = false;

  constructor(
    private bookService: BookService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadBorrowings();
    this.loadWaitingLists();
  }

  loadBorrowings(): void {
    this.loading = true;
    this.bookService.getUserBorrowings().subscribe({
      next: (response) => {
        this.borrowings = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error("Erreur au chargement des emprunts", error);
        this.loading = false;
      },
    });
  }

  loadWaitingLists(): void {
    this.bookService.getMyWaitingList().subscribe({
      next: (response) => {
        this.waitingLists = response.data || [];
      },
      error: (error) => {
        console.error("Erreur au chargement des listes d'attente", error);
      },
    });
  }

  returnBook(borrowingId: string): void {
    this.returning = true;
    this.bookService.returnBook(borrowingId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadBorrowings();
        }
        this.returning = false;
      },
      error: (error) => {
        console.error("Erreur lors du retour", error);
        this.returning = false;
      },
    });
  }

  leaveWaitingList(bookId: string): void {
    this.removing = true;
    this.bookService.leaveWaitingList(bookId).subscribe({
      next: (response) => {
        this.loadWaitingLists();
        this.removing = false;
      },
      error: (error) => {
        console.error("Erreur", error);
        this.removing = false;
      },
    });
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }
}
