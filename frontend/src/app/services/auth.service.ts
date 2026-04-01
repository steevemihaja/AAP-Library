import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  address?: any;
  createdAt: string;
}

interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
}

interface UpdateProfileResponse {
  success: boolean;
  user: User;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:5000/api";
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  private tokenKey = "token";
  private userKey = "user";

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userSubject.next(user);
      } catch (e) {
        console.error("Error parsing user:", e);
        this.clearStorage();
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.userKey, JSON.stringify(response.user));
            this.userSubject.next(response.user);
          }
        }),
      );
  }

  register(userData: any): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.userKey, JSON.stringify(response.user));
            this.userSubject.next(response.user);
          }
        }),
      );
  }

  logout(): void {
    this.clearStorage();
    this.userSubject.next(null);
  }

  private clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "admin" || user?.role === "librarian";
  }

  updateProfile(profileData: any): Observable<UpdateProfileResponse> {
    return this.http
      .put<UpdateProfileResponse>(`${this.apiUrl}/auth/profile`, profileData)
      .pipe(
        tap((response) => {
          if (response.user) {
            localStorage.setItem(this.userKey, JSON.stringify(response.user));
            this.userSubject.next(response.user);
          }
        }),
      );
  }
}
