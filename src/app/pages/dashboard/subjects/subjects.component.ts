import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudyManagerService, Subject, CreateSubjectRequest } from '../../../services/study-manager.service';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  subjects = signal<Subject[]>([]);
  isLoading = signal(false);
  showCreateForm = signal(false);
  editingSubject = signal<Subject | null>(null);

  newSubject: CreateSubjectRequest = {
    name: '',
    description: ''
  };

  constructor(private studyManagerService: StudyManagerService) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.isLoading.set(true);
    this.studyManagerService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar matérias:', error);
        this.isLoading.set(false);
      }
    });
  }

  createSubject(): void {
    if (!this.newSubject.name.trim()) return;

    this.isLoading.set(true);
    this.studyManagerService.createSubject(this.newSubject).subscribe({
      next: (subject) => {
        this.subjects.update(subjects => [...subjects, subject]);
        this.resetForm();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao criar matéria:', error);
        this.isLoading.set(false);
      }
    });
  }

  updateSubject(subject: Subject): void {
    this.isLoading.set(true);
    this.studyManagerService.updateSubject(subject.id, subject).subscribe({
      next: (updatedSubject) => {
        this.subjects.update(subjects => 
          subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s)
        );
        this.editingSubject.set(null);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao atualizar matéria:', error);
        this.isLoading.set(false);
      }
    });
  }

  deleteSubject(id: string): void {
    if (!confirm('Tem certeza que deseja excluir esta matéria?')) return;

    this.isLoading.set(true);
    this.studyManagerService.deleteSubject(id).subscribe({
      next: () => {
        this.subjects.update(subjects => subjects.filter(s => s.id !== id));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao excluir matéria:', error);
        this.isLoading.set(false);
      }
    });
  }

  startEdit(subject: Subject): void {
    this.editingSubject.set({ ...subject });
  }

  cancelEdit(): void {
    this.editingSubject.set(null);
  }

  resetForm(): void {
    this.newSubject = { name: '', description: '' };
    this.showCreateForm.set(false);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
