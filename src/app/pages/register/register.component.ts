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
    if (this.userData().password !== this.userData().confirmPassword) {
      this.authService.error.set('As senhas não coincidem');
      return;
    }

    if (this.userData().name && this.userData().email && this.userData().password) {
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
