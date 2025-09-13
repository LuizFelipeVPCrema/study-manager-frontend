import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = this.getApiUrl();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private getApiUrl(): string {
    // Em desenvolvimento no Docker, usa proxy local
    // Em produção, pode usar variável de ambiente
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      if (baseUrl.includes('localhost:4000') || baseUrl.includes('127.0.0.1:4000')) {
        return 'http://localhost:8081/api/v1'; // Usa proxy configurado
      }
    }
    // Fallback para produção ou outros ambientes
    return 'http://localhost:8081/api/v1';
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    
    if (token && user && user !== 'undefined' && user !== 'null') {
      try {
        const parsedUser = JSON.parse(user);
        this.currentUserSubject.next(parsedUser);
      } catch (error) {
        console.error('Erro ao fazer parse do usuário do localStorage:', error);
        // Limpar dados inválidos do localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);
    
    // Garantir que os dados sejam enviados como JSON válido
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };
    

    
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap({
        next: (response) => {
          this.setSession(response);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Login error details:', error);
          this.error.set(error.error?.message || 'Erro ao fazer login');
          this.isLoading.set(false);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);
    
    // Garantir que os dados sejam enviados como JSON válido
    const registerData = {
      name: userData.name,
      email: userData.email,
      password: userData.password
    };
    

    
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerData, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap({
        next: (response) => {
          this.setSession(response);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Register error details:', error);
          
          // Tratar erros específicos do backend
          if (error.error?.error) {
            const errorMessage = error.error.error;
            if (errorMessage.includes('Password') && errorMessage.includes('min')) {
              this.error.set('A senha deve ter pelo menos 6 caracteres');
            } else if (errorMessage.includes('Email')) {
              this.error.set('Email inválido ou já cadastrado');
            } else if (errorMessage.includes('Name')) {
              this.error.set('Nome inválido');
            } else {
              this.error.set(errorMessage);
            }
          } else {
            this.error.set('Erro ao fazer cadastro. Tente novamente.');
          }
          
          this.isLoading.set(false);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {
      refresh_token: refreshToken
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(response => this.setSession(response))
    );
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || token === 'undefined' || token === 'null') return false;
    
    // Verificar se o token não expirou
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  clearError(): void {
    this.error.set(null);
  }
}
