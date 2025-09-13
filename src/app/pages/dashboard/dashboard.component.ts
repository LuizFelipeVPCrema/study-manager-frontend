import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isSidebarOpen = signal(true);
  currentUser = signal<User | null>(null);
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Carregar dados do usuário atual
    this.currentUser.set(this.authService.getCurrentUser());
    
    // Inscrever-se nas mudanças do usuário
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get user() {
    return this.currentUser();
  }
}
