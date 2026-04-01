import { Routes } from "@angular/router";
import { authGuardFn, adminGuardFn } from "./guards/auth.guards";
import { HomeComponent } from "./pages/home.component";
import { LoginComponent } from "./pages/auth/login.component";
import { RegisterComponent } from "./pages/auth/register.component";
import { BookListComponent } from "./pages/books/book-list.component";
import { BookDetailComponent } from "./pages/books/book-detail.component";
import { BookAddComponent } from "./pages/books/book-add.component";
import { MyBorrowingsComponent } from "./pages/user/my-borrowings.component";
import { DashboardComponent } from "./pages/dashboard.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "books",
    component: BookListComponent,
  },
  {
    path: "books/add",
    component: BookAddComponent,
    canActivate: [adminGuardFn],
  },
  {
    path: "books/:id",
    component: BookDetailComponent,
  },
  {
    path: "my-borrowings",
    component: MyBorrowingsComponent,
    canActivate: [authGuardFn],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [authGuardFn],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
