import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  subject: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Bibliography {
  id: string;
  title: string;
  author: string;
  year: number;
  publisher: string;
  url?: string;
  notes?: string;
  created_at: string;
}

export interface StudyFile {
  id: string;
  name: string;
  original_name: string;
  size: number;
  type: string;
  url: string;
  subject: string;
  created_at: string;
}

export interface CreateStudyPlanRequest {
  title: string;
  description: string;
  subject: string;
  start_date: string;
  end_date: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  subject: string;
  tags: string[];
}

export interface CreateBibliographyRequest {
  title: string;
  author: string;
  year: number;
  publisher: string;
  url?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudyManagerService {
  private readonly API_URL = 'http://localhost:8080/api/v1';
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Study Plans
  getStudyPlans(): Observable<StudyPlan[]> {
    this.isLoading.set(true);
    return this.http.get<StudyPlan[]>(`${this.API_URL}/study-plans`, {
      headers: this.getHeaders()
    });
  }

  getStudyPlan(id: string): Observable<StudyPlan> {
    return this.http.get<StudyPlan>(`${this.API_URL}/study-plans/${id}`, {
      headers: this.getHeaders()
    });
  }

  createStudyPlan(plan: CreateStudyPlanRequest): Observable<StudyPlan> {
    this.isLoading.set(true);
    return this.http.post<StudyPlan>(`${this.API_URL}/study-plans`, plan, {
      headers: this.getHeaders()
    });
  }

  updateStudyPlan(id: string, plan: Partial<StudyPlan>): Observable<StudyPlan> {
    return this.http.put<StudyPlan>(`${this.API_URL}/study-plans/${id}`, plan, {
      headers: this.getHeaders()
    });
  }

  deleteStudyPlan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/study-plans/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Notes
  getNotes(): Observable<Note[]> {
    this.isLoading.set(true);
    return this.http.get<Note[]>(`${this.API_URL}/notes`, {
      headers: this.getHeaders()
    });
  }

  getNote(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.API_URL}/notes/${id}`, {
      headers: this.getHeaders()
    });
  }

  createNote(note: CreateNoteRequest): Observable<Note> {
    this.isLoading.set(true);
    return this.http.post<Note>(`${this.API_URL}/notes`, note, {
      headers: this.getHeaders()
    });
  }

  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.API_URL}/notes/${id}`, note, {
      headers: this.getHeaders()
    });
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/notes/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Bibliography
  getBibliography(): Observable<Bibliography[]> {
    this.isLoading.set(true);
    return this.http.get<Bibliography[]>(`${this.API_URL}/bibliography`, {
      headers: this.getHeaders()
    });
  }

  getBibliographyItem(id: string): Observable<Bibliography> {
    return this.http.get<Bibliography>(`${this.API_URL}/bibliography/${id}`, {
      headers: this.getHeaders()
    });
  }

  createBibliographyItem(item: CreateBibliographyRequest): Observable<Bibliography> {
    this.isLoading.set(true);
    return this.http.post<Bibliography>(`${this.API_URL}/bibliography`, item, {
      headers: this.getHeaders()
    });
  }

  updateBibliographyItem(id: string, item: Partial<Bibliography>): Observable<Bibliography> {
    return this.http.put<Bibliography>(`${this.API_URL}/bibliography/${id}`, item, {
      headers: this.getHeaders()
    });
  }

  deleteBibliographyItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/bibliography/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Files
  getFiles(): Observable<StudyFile[]> {
    this.isLoading.set(true);
    return this.http.get<StudyFile[]>(`${this.API_URL}/files`, {
      headers: this.getHeaders()
    });
  }

  uploadFile(file: File, subject: string): Observable<StudyFile> {
    this.isLoading.set(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post<StudyFile>(`${this.API_URL}/files/upload`, formData, {
      headers
    });
  }

  deleteFile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/files/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.API_URL}/dashboard/stats`, {
      headers: this.getHeaders()
    });
  }

  clearError(): void {
    this.error.set(null);
  }
}
