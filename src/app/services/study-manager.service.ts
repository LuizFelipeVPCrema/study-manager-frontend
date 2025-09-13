import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Interfaces baseadas na documentação do backend
export interface Student {
  id: string;
  name: string;
  email: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  student_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: string;
  subject_id: string;
  title: string;
  description: string;
  due_date: string;
  type: 'exam' | 'assignment' | 'project' | 'quiz';
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface StudyContent {
  id: string;
  subject_id: string;
  exam_id?: string;
  title: string;
  description: string;
  is_completed: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  exam_id: string;
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ExamReference {
  id: string;
  exam_id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  url: string;
  description: string;
  type: 'book' | 'article' | 'website' | 'video' | 'other';
  created_at: string;
  updated_at: string;
}

// Request interfaces
export interface CreateStudentRequest {
  name: string;
  email: string;
}

export interface CreateSubjectRequest {
  name: string;
  description: string;
}

export interface CreateExamRequest {
  subject_id: string;
  title: string;
  description: string;
  due_date?: string;
  type?: string;
}

export interface CreateStudyContentRequest {
  subject_id: string;
  exam_id?: string;
  title: string;
  description: string;
  order?: number;
}

export interface CreateAttachmentRequest {
  exam_id: string;
  file: File;
  description?: string;
}

export interface CreateExamReferenceRequest {
  exam_id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn?: string;
  url?: string;
  description?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudyManagerService {
  private readonly API_URL = this.getApiUrl();
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getApiUrl(): string {
    // Em desenvolvimento no Docker, usa proxy local
    // Em produção, pode usar variável de ambiente
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      if (baseUrl.includes('localhost:4000') || baseUrl.includes('127.0.0.1:4000')) {
        return '/api/v1'; // Usa proxy configurado para study manager
      }
    }
    // Fallback para produção ou outros ambientes
    return 'http://localhost:8080/api/v1';
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Client-ID': 'your_client_id' // Será configurado dinamicamente
    });
  }

  // Students
  createStudent(student: CreateStudentRequest): Observable<Student> {
    this.isLoading.set(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-User-ID': this.authService.getCurrentUser()?.email || ''
    });
    
    return this.http.post<Student>(`${this.API_URL}/students`, student, { headers });
  }

  getStudents(): Observable<Student[]> {
    this.isLoading.set(true);
    return this.http.get<Student[]>(`${this.API_URL}/students`, {
      headers: this.getHeaders()
    });
  }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/students/${id}`, {
      headers: this.getHeaders()
    });
  }

  getStudentByUserId(userId: string): Observable<Student> {
    return this.http.get<Student>(`${this.API_URL}/students/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.API_URL}/students/${id}`, student, {
      headers: this.getHeaders()
    });
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/students/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Subjects
  createSubject(subject: CreateSubjectRequest): Observable<Subject> {
    this.isLoading.set(true);
    return this.http.post<Subject>(`${this.API_URL}/subjects`, subject, {
      headers: this.getHeaders()
    });
  }

  getSubjects(): Observable<Subject[]> {
    this.isLoading.set(true);
    return this.http.get<Subject[]>(`${this.API_URL}/subjects`, {
      headers: this.getHeaders()
    });
  }

  getSubject(id: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.API_URL}/subjects/${id}`, {
      headers: this.getHeaders()
    });
  }

  getSubjectWithExams(id: string): Observable<Subject & { exams: Exam[] }> {
    return this.http.get<Subject & { exams: Exam[] }>(`${this.API_URL}/subjects/${id}/exams`, {
      headers: this.getHeaders()
    });
  }

  updateSubject(id: string, subject: Partial<Subject>): Observable<Subject> {
    return this.http.put<Subject>(`${this.API_URL}/subjects/${id}`, subject, {
      headers: this.getHeaders()
    });
  }

  deleteSubject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/subjects/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Exams
  createExam(exam: CreateExamRequest): Observable<Exam> {
    this.isLoading.set(true);
    return this.http.post<Exam>(`${this.API_URL}/exams`, exam, {
      headers: this.getHeaders()
    });
  }

  getExams(): Observable<Exam[]> {
    this.isLoading.set(true);
    return this.http.get<Exam[]>(`${this.API_URL}/exams`, {
      headers: this.getHeaders()
    });
  }

  getExam(id: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.API_URL}/exams/${id}`, {
      headers: this.getHeaders()
    });
  }

  getExamDetails(id: string): Observable<Exam & { attachments: Attachment[], references: ExamReference[], study_contents: StudyContent[] }> {
    return this.http.get<Exam & { attachments: Attachment[], references: ExamReference[], study_contents: StudyContent[] }>(`${this.API_URL}/exams/${id}/details`, {
      headers: this.getHeaders()
    });
  }

  updateExam(id: string, exam: Partial<Exam>): Observable<Exam> {
    return this.http.put<Exam>(`${this.API_URL}/exams/${id}`, exam, {
      headers: this.getHeaders()
    });
  }

  deleteExam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/exams/${id}`, {
      headers: this.getHeaders()
    });
  }

  getExamsBySubject(subjectId: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.API_URL}/subjects/${subjectId}/exams`, {
      headers: this.getHeaders()
    });
  }

  // Study Contents
  createStudyContent(content: CreateStudyContentRequest): Observable<StudyContent> {
    this.isLoading.set(true);
    return this.http.post<StudyContent>(`${this.API_URL}/study-contents`, content, {
      headers: this.getHeaders()
    });
  }

  getStudyContent(id: string): Observable<StudyContent> {
    return this.http.get<StudyContent>(`${this.API_URL}/study-contents/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateStudyContent(id: string, content: Partial<StudyContent>): Observable<StudyContent> {
    return this.http.put<StudyContent>(`${this.API_URL}/study-contents/${id}`, content, {
      headers: this.getHeaders()
    });
  }

  deleteStudyContent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/study-contents/${id}`, {
      headers: this.getHeaders()
    });
  }

  completeStudyContent(id: string): Observable<StudyContent> {
    return this.http.put<StudyContent>(`${this.API_URL}/study-contents/${id}/complete`, {}, {
      headers: this.getHeaders()
    });
  }

  reorderStudyContents(contents: { id: string, order: number }[]): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/study-contents/reorder`, { contents }, {
      headers: this.getHeaders()
    });
  }

  getStudyContentsBySubject(subjectId: string): Observable<StudyContent[]> {
    return this.http.get<StudyContent[]>(`${this.API_URL}/subjects/${subjectId}/study-contents`, {
      headers: this.getHeaders()
    });
  }

  getStudyContentsByExam(examId: string): Observable<StudyContent[]> {
    return this.http.get<StudyContent[]>(`${this.API_URL}/exams/${examId}/study-contents`, {
      headers: this.getHeaders()
    });
  }

  // Attachments
  uploadAttachment(examId: string, file: File, description?: string): Observable<Attachment> {
    this.isLoading.set(true);
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'X-Client-ID': 'your_client_id'
    });

    return this.http.post<Attachment>(`${this.API_URL}/exams/${examId}/attachments`, formData, {
      headers
    });
  }

  getAttachmentsByExam(examId: string): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.API_URL}/exams/${examId}/attachments`, {
      headers: this.getHeaders()
    });
  }

  getAttachment(id: string): Observable<Attachment> {
    return this.http.get<Attachment>(`${this.API_URL}/attachments/${id}`, {
      headers: this.getHeaders()
    });
  }

  downloadAttachment(id: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/attachments/${id}/download`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  deleteAttachment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/attachments/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Exam References
  createExamReference(reference: CreateExamReferenceRequest): Observable<ExamReference> {
    this.isLoading.set(true);
    return this.http.post<ExamReference>(`${this.API_URL}/exams/${reference.exam_id}/references`, reference, {
      headers: this.getHeaders()
    });
  }

  getReferencesByExam(examId: string): Observable<ExamReference[]> {
    return this.http.get<ExamReference[]>(`${this.API_URL}/exams/${examId}/references`, {
      headers: this.getHeaders()
    });
  }

  getExamReference(id: string): Observable<ExamReference> {
    return this.http.get<ExamReference>(`${this.API_URL}/references/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateExamReference(id: string, reference: Partial<ExamReference>): Observable<ExamReference> {
    return this.http.put<ExamReference>(`${this.API_URL}/references/${id}`, reference, {
      headers: this.getHeaders()
    });
  }

  deleteExamReference(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/references/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Health Check
  getHealthStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/health`);
  }

  clearError(): void {
    this.error.set(null);
  }
}
