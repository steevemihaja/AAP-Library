import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BookService } from "../../services/book.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-my-borrowings",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 flex items-center gap-2">
          <span>📋</span> {{ isUser ? "Mes emprunts" : "Gestion des emprunts" }}
        </h1>

        <div *ngIf="loading" class="p-8 text-center text-gray-600">
          Chargement en cours...
        </div>

        <ng-container *ngIf="!loading">
          <div
            *ngIf="isUser"
            class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div
              class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <p
                class="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Emprunts en cours
              </p>
              <p class="text-4xl font-bold text-blue-600 mt-2">
                {{ activeAndPending.length }}
              </p>
            </div>
            <div
              class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <p
                class="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Livres en retard
              </p>
              <p class="text-4xl font-bold text-red-500 mt-2">
                {{ overdueBorrowings.length }}
              </p>
            </div>
            <div
              class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <p
                class="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Pénalités
              </p>
              <p class="text-4xl font-bold text-amber-600 mt-2">
                {{ totalPenalties }}€
              </p>
            </div>
            <div
              class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <p
                class="text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Ma liste d'attente
              </p>
              <p class="text-4xl font-bold text-purple-600 mt-2">
                {{ waitingLists.length }}
              </p>
            </div>
          </div>

          <div *ngIf="borrowings.length > 0" class="space-y-4">
            <div
              *ngFor="let b of borrowings"
              class="bg-white rounded-xl shadow-sm p-6 border flex flex-col md:flex-row justify-between items-start gap-4"
              [ngClass]="isOverdue(b) ? 'border-red-200' : 'border-gray-100'"
            >
              <div class="flex-1 w-full">
                <div class="flex items-start justify-between">
                  <div>
                    <div
                      *ngIf="!isUser"
                      class="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg"
                    >
                      <div
                        class="text-[11px] font-bold uppercase text-blue-600 mb-1"
                      >
                        👤 Informations Emprunteur
                      </div>
                      <div class="text-sm font-bold text-gray-900">
                        {{ b.user?.firstName }} {{ b.user?.lastName }}
                      </div>
                      <div class="text-xs text-gray-600 mb-2">
                        {{ b.user?.email }}
                      </div>

                      <div
                        class="flex items-center gap-2 mt-2 pt-2 border-t border-blue-100"
                      >
                        <span class="text-xs font-semibold text-gray-500 italic"
                          >Situation pénalité :</span
                        >
                        <span
                          *ngIf="getLinePenalty(b) > 0"
                          class="text-sm font-bold text-red-600"
                        >
                          {{ getLinePenalty(b) }}€
                          {{
                            b.status === "returned"
                              ? "(Déjà réglée)"
                              : "(En cours)"
                          }}
                        </span>
                        <span
                          *ngIf="getLinePenalty(b) <= 0"
                          class="text-sm font-bold text-green-600"
                        >
                          Aucune
                        </span>
                      </div>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900">
                      {{ b.book?.title }}
                    </h3>
                    <p class="text-gray-500">par {{ b.book?.author }}</p>
                  </div>
                  <span
                    class="ml-4 px-3 py-1 rounded-full text-xs font-semibold"
                    [ngClass]="
                      b.status === 'returned'
                        ? 'bg-green-100 text-green-700'
                        : isOverdue(b)
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                    "
                  >
                    {{
                      b.status === "returned"
                        ? "Retourné"
                        : isOverdue(b)
                          ? "En retard"
                          : "Actif"
                    }}
                  </span>
                </div>

                <div
                  class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm"
                >
                  <p>
                    <span class="text-gray-400">Date d'emprunt :</span>
                    {{ b.borrowDate | date: "dd/MM/yyyy" }}
                  </p>
                  <p
                    class="font-semibold"
                    [ngClass]="
                      b.status === 'returned'
                        ? 'text-green-600'
                        : isOverdue(b)
                          ? 'text-red-600'
                          : 'text-green-600'
                    "
                  >
                    <ng-container *ngIf="b.status === 'returned'"
                      >✅ Retourné le
                      {{ b.returnDate | date: "dd/MM/yyyy" }}</ng-container
                    >
                    <ng-container
                      *ngIf="b.status !== 'returned' && isOverdue(b)"
                      >❌ EN RETARD de
                      {{ getDaysOverdue(b.dueDate) }} jour(s)</ng-container
                    >
                    <ng-container
                      *ngIf="b.status !== 'returned' && !isOverdue(b)"
                      >📅 Retour attendu :
                      {{ b.dueDate | date: "dd/MM/yyyy" }}</ng-container
                    >
                  </p>
                </div>
              </div>

              <div
                *ngIf="isUser"
                class="flex flex-wrap gap-2 md:flex-col md:items-end"
              >
                <ng-container *ngIf="b.status !== 'returned'">
                  <button
                    (click)="openReturnModal(b)"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Retourner
                  </button>
                  <button
                    *ngIf="!isOverdue(b) && (b.renewalCount || 0) < 2"
                    (click)="handleRenew(b._id)"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Prolonger
                  </button>
                  <button
                    (click)="openNoteModal(b)"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    📝 Note
                  </button>
                </ng-container>
                <button
                  *ngIf="b.status === 'returned'"
                  (click)="openReviewModal(b)"
                  class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium"
                >
                  ⭐ Donner un avis
                </button>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>

    <div
      *ngIf="returnModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-lg font-bold mb-4">📤 Retourner le livre</h2>
        <input
          type="date"
          [(ngModel)]="returnDate"
          class="w-full border rounded-lg p-2 mb-4"
        />
        <div class="flex gap-3 justify-end">
          <button
            (click)="returnModal = null"
            class="px-4 py-2 border rounded-lg"
          >
            Annuler
          </button>
          <button
            (click)="handleReturn()"
            [disabled]="submitting"
            class="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>

    <div
      *ngIf="reviewModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 class="text-lg font-bold mb-4">
          ⭐ Avis sur {{ reviewModal.bookTitle }}
        </h2>
        <input
          type="number"
          [(ngModel)]="reviewRating"
          min="1"
          max="5"
          class="w-full border rounded-lg p-2 mb-2"
        />
        <textarea
          [(ngModel)]="reviewContent"
          class="w-full border rounded-lg p-2 mb-2"
          placeholder="Commentaire..."
        ></textarea>
        <input
          type="text"
          [(ngModel)]="reviewTags"
          placeholder="Tags (séparés par des virgules)"
          class="w-full border rounded-lg p-2 mb-4"
        />
        <div class="flex gap-3 justify-end">
          <button
            (click)="reviewModal = null"
            class="px-4 py-2 border rounded-lg"
          >
            Annuler
          </button>
          <button
            (click)="handleSubmitReview()"
            [disabled]="submitting"
            class="px-4 py-2 bg-amber-500 text-white rounded-lg"
          >
            Publier
          </button>
        </div>
      </div>
    </div>
  `,
})
export class MyBorrowingsComponent implements OnInit {
  borrowings: any[] = [];
  waitingLists: any[] = [];
  loading = false;
  submitting = false;

  returnModal: any = null;
  noteModal: any = null;
  reviewModal: any = null;

  returnDate = "";
  reviewRating = 5;
  reviewTitle = "Mon avis";
  reviewContent = "";
  reviewTags = "";
  noteText = "";

  constructor(
    private bookService: BookService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadBorrowings();
    this.loadWaitingLists();
  }

  get isUser(): boolean {
    return this.authService.getCurrentUser()?.role === "user";
  }

  get activeAndPending(): any[] {
    return this.borrowings.filter(
      (b) => b.status === "active" || b.status === "pending",
    );
  }

  get overdueBorrowings(): any[] {
    return this.borrowings.filter((b) => this.isOverdue(b));
  }

  get totalPenalties(): number {
    return this.borrowings.reduce((sum, b) => sum + this.getLinePenalty(b), 0);
  }

  getLinePenalty(b: any): number {
    const fixed = b.penalty?.amount || 0;
    const estimated =
      this.isOverdue(b) && b.status !== "returned"
        ? this.getDaysOverdue(b.dueDate)
        : 0;
    return fixed + estimated;
  }

  isOverdue(b: any): boolean {
    if (b.status === "returned") return false;
    return new Date(b.dueDate) < new Date();
  }

  getDaysLeft(dueDate: string): number {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getDaysOverdue(dueDate: string): number {
    const days = this.getDaysLeft(dueDate);
    return days < 0 ? Math.abs(days) : 0;
  }

  loadBorrowings(): void {
    this.loading = true;
    this.bookService.getUserBorrowings().subscribe({
      next: (res: any) => {
        this.borrowings = res.data || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  loadWaitingLists(): void {
    this.bookService
      .getMyWaitingList()
      .subscribe({ next: (res: any) => (this.waitingLists = res.data || []) });
  }

  openReturnModal(b: any): void {
    this.returnModal = { borrowingId: b._id, bookTitle: b.book?.title };
  }
  openNoteModal(b: any): void {
    this.noteModal = { borrowingId: b._id };
    this.noteText = b.notes || "";
  }
  openReviewModal(b: any): void {
    this.reviewModal = { borrowingId: b._id, bookTitle: b.book?.title };
    this.reviewRating = 5;
    this.reviewContent = "";
    this.reviewTags = "";
  }

  handleReturn(): void {
    if (!this.returnModal) return;
    this.submitting = true;
    const date = this.returnDate
      ? new Date(this.returnDate).toISOString()
      : new Date().toISOString();
    this.bookService
      .returnBook(this.returnModal.borrowingId, {
        condition: "good",
        returnDate: date,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.returnModal = null;
          this.loadBorrowings();
        },
        error: () => (this.submitting = false),
      });
  }

  handleRenew(id: string): void {
    this.bookService
      .renewBook(id)
      .subscribe({ next: () => this.loadBorrowings() });
  }

  handleSaveNote(): void {
    if (!this.noteModal) return;
    this.bookService
      .saveNote(this.noteModal.borrowingId, this.noteText)
      .subscribe({
        next: () => {
          this.noteModal = null;
          this.loadBorrowings();
        },
      });
  }

  handleSubmitReview(): void {
    if (!this.reviewModal) return;
    this.submitting = true;
    const tagsArray = this.reviewTags
      ? this.reviewTags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];
    this.bookService
      .submitReview(this.reviewModal.borrowingId, {
        rating: this.reviewRating,
        title: this.reviewTitle,
        content: this.reviewContent,
        tags: tagsArray,
      })
      .subscribe({
        next: () => {
          this.reviewModal = null;
          this.submitting = false;
        },
        error: () => (this.submitting = false),
      });
  }
}
