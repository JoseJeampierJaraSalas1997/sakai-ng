// auth.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private isAuthenticated = false;
  private userRole: string | null = null;
  private lastActivityTime: number | null = null;
  private sessionExpired = false;

  constructor(private router: Router) {
    this.isAuthenticated = localStorage.getItem('authToken') !== null;
    this.lastActivityTime = Date.now();
  }

  login(): void {
    this.isAuthenticated = true;
    const token = this.generateUserToken();
    localStorage.setItem('authToken', token);
    this.lastActivityTime = Date.now();
    this.sessionExpired = false;
    console.log('Este es mi token:');
    console.log(token);
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
    this.sessionExpired = false;
  }

  isLoggedIn(): boolean {
    const isTokenExpired = this.lastActivityTime !== null && (Date.now() - this.lastActivityTime) > 720000;
    return this.isAuthenticated && !isTokenExpired;
  }

  isSessionExpired(): boolean {
    return this.sessionExpired;
  }

  setUserRole(role: string | null): void {
    this.userRole = role;
  }

  getRole(): string | null {
    return this.userRole;
  }

  canActivate(): boolean {
    if (this.isLoggedIn()) {
      this.lastActivityTime = Date.now();
      this.sessionExpired = false;
      return true;
    } else {
      if (!this.sessionExpired) {
        Swal.fire({
          icon: 'warning',
          title: 'Sesión Expirada',
          text: '¡Su sesión ha expirado debido a inactividad!',
        });
        this.sessionExpired = true;
      }
      this.redirectToLogin();
      return false;
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private generateUserToken(): string {
    return `PROYECTOUNFVEQUIPO04-${new Date().getTime()}`;
  }
}
