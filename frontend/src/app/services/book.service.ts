import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  coverImage?: string;
  publishedDate?: string;
  createdAt: string;
}

interface BookResponse {
  success: boolean;
  data: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface BorrowResponse {
  success: boolean;
  data: any;
}

interface ReviewResponse {
  success: boolean;
  data: any;
}

@Injectable({
  providedIn: "root",
})
export class BookService {
  private apiUrl = "http://localhost:5000/api";

  constructor(private http: HttpClient) {}

  getBooks(params?: any): Observable<BookResponse> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set("page", params.page);
      if (params.limit) httpParams = httpParams.set("limit", params.limit);
      if (params.search) httpParams = httpParams.set("search", params.search);
      if (params.genre) httpParams = httpParams.set("genre", params.genre);
      if (params.author) httpParams = httpParams.set("author", params.author);
    }
    return this.http.get<BookResponse>(`${this.apiUrl}/books`, {
      params: httpParams,
    });
  }

  getBook(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`);
  }

  createBook(bookData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, bookData);
  }

  updateBook(id: string, bookData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/books/${id}`, bookData);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${id}`);
  }

  searchBooks(query: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/books`, {
      params: { search: query },
    });
  }

  getGenres(): Observable<any> {
    return this.getBooks().pipe(
      map((response) => {
        const genres = new Set<string>();
        response.data?.forEach((book: any) => {
          if (book.genres && Array.isArray(book.genres)) {
            book.genres.forEach((g: string) => genres.add(g));
          }
        });
        return { success: true, genres: Array.from(genres) };
      }),
    );
  }

  borrowBook(bookId: string, dueDate: string): Observable<BorrowResponse> {
    return this.http.post<BorrowResponse>(`${this.apiUrl}/borrowings`, {
      bookId,
      dueDate,
    });
  }

  returnBook(
    borrowingId: string,
    body: { condition?: string; returnDate?: string } = {},
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/borrowings/${borrowingId}/return`,
      body,
    );
  }

  renewBook(borrowingId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/borrowings/${borrowingId}/renew`, {});
  }

  saveNote(borrowingId: string, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/borrowings/${borrowingId}/note`, {
      notes,
    });
  }

  submitReview(
    borrowingId: string,
    reviewData: {
      rating: number;
      title: string;
      content: string;
      tags: string[];
    },
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/borrowings/${borrowingId}/review`,
      reviewData,
    );
  }

  getUserBorrowings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/borrowings/my-borrowings`);
  }

  getAllBorrowings(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set("page", params.page);
      if (params.limit) httpParams = httpParams.set("limit", params.limit);
      if (params.status) httpParams = httpParams.set("status", params.status);
    }
    return this.http.get(`${this.apiUrl}/borrowings`, { params: httpParams });
  }

  addReview(
    bookId: string,
    rating: number,
    title: string,
    content: string,
    tags?: string[],
  ): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${this.apiUrl}/reviews`, {
      bookId,
      rating,
      title,
      content,
      tags: tags || [],
    });
  }

  getBookReviews(bookId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/book/${bookId}`);
  }

  // ✅ CORRECT
  getMyWaitingList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/waiting-list/my-list`);
  }

  joinWaitingList(bookId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/waiting-list`, { bookId });
  }

  leaveWaitingList(bookId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/waiting-list/${bookId}`);
  }

  // ✅ CORRECT
  getUserWaitingLists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/waiting-list/my-list`);
  }
}