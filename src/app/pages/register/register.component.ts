import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validações do frontend
    if (!this.userData().name || !this.userData().email || !this.userData().password) {
      this.authService.error.set('Todos os campos são obrigatórios');
      return;
    }

    if (this.userData().password !== this.userData().confirmPassword) {
      this.authService.error.set('As senhas não coincidem');
      return;
    }

    // Validação de senha - mínimo 6 caracteres
    if (this.userData().password.length < 6) {
      this.authService.error.set('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData().email)) {
      this.authService.error.set('Digite um email válido');
      return;
    }

    // Validação de nome - mínimo 2 caracteres
    if (this.userData().name.trim().length < 2) {
      this.authService.error.set('O nome deve ter pelo menos 2 caracteres');
      return;
    }

    const { confirmPassword, ...registerData } = this.userData();
    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Register error:', error);
      }
    });
  }

  get isLoading() {
    return this.authService.isLoading;
  }

  get error() {
    return this.authService.error;
  }

  clearError(): void {
    this.authService.clearError();
  }
}
