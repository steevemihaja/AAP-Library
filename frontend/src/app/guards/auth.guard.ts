import { Injectable } from "@angular/core";
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = new AuthService(null!);
  const router = new Router(null!, null!);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(["/login"]);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = new AuthService(null!);
  const router = new Router(null!, null!);

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(["/"]);
  return false;
};
