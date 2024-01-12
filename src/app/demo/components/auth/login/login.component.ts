// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
      transform: scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `]
})
export class LoginComponent {
  private apiUrl = environment.apiUrl;  
  loginForm: FormGroup;
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  login(): void {
    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.http.post<any>(`${this.apiUrl}getAuthLogin?user=${this.email}&password=${this.password}`, loginData)
      .subscribe(
        (response) => {
          if (response.success) {
            console.log('Inicio de sesión exitoso');
            this.authService.login();

            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              html: `
                <div style="
                  background: linear-gradient(to right, #FFA500	, #FF9691);
                  padding: 20px;
                  border-radius: 10px;
                  font-family: 'Arial', sans-serif;
                  color: #fff;
                ">
                  <h3 style="color: #fff; font-weight: bold;">¡Bienvenido!</h3>
                  <p style="color: #fff; margin-bottom: 10px;">
                    Usuario: ${response.user.username}<br>
                    Rol: ${response.user.role_name}<br>
                    Nombre y apellidos: ${response.user.first_name} ${response.user.last_name}<br>
                    Escuela: ${response.user.school_name}
                  </p>
                </div>
              `,
              showConfirmButton: false,
              timer: 9000,
              didClose: () => {
                this.router.navigate(['/']);
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message
            });
          }
        },
        (error) => {
          // Manejar el error
          console.error('Error al realizar la solicitud HTTP:', error);
        }
      );
  }
}