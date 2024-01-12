// auth.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private isAuthenticated = false;
  private userRole: string | null = null;

  constructor(private router: Router) {}

  login(): void {
    // Aquí iría la lógica de inicio de sesión
    this.isAuthenticated = true;
  }

  logout(): void {

    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  setUserRole(role: string | null): void {
    this.userRole = role;
  }

  getRole(): string | null {
    return this.userRole;
  }
  
  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.redirectToLogin();
      return false;
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
