import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudyManagerService, Exam, Subject, CreateExamRequest } from '../../../services/study-manager.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {
  exams = signal<Exam[]>([]);
  subjects = signal<Subject[]>([]);
  isLoading = signal(false);
  showCreateForm = signal(false);
  editingExam = signal<Exam | null>(null);

  newExam: CreateExamRequest = {
    subject_id: '',
    title: '',
    description: '',
    due_date: '',
    type: 'exam'
  };

  examTypes = [
    { value: 'exam', label: 'Prova' },
    { value: 'assignment', label: 'Trabalho' },
    { value: 'project', label: 'Projeto' },
    { value: 'quiz', label: 'Quiz' }
  ];

  statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'completed', label: 'Concluído' }
  ];

  constructor(private studyManagerService: StudyManagerService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    
    Promise.all([
      this.studyManagerService.getExams().toPromise(),
      this.studyManagerService.getSubjects().toPromise()
    ]).then(([exams, subjects]) => {
      this.exams.set(exams || []);
      this.subjects.set(subjects || []);
      this.isLoading.set(false);
    }).catch(error => {
      console.error('Erro ao carregar dados:', error);
      this.isLoading.set(false);
    });
  }

  createExam(): void {
    if (!this.newExam.title.trim() || !this.newExam.subject_id) return;

    this.isLoading.set(true);
    this.studyManagerService.createExam(this.newExam).subscribe({
      next: (exam) => {
        this.exams.update(exams => [...exams, exam]);
        this.resetForm();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao criar prova/trabalho:', error);
        this.isLoading.set(false);
      }
    });
  }

  updateExam(exam: Exam): void {
    this.isLoading.set(true);
    this.studyManagerService.updateExam(exam.id, exam).subscribe({
      next: (updatedExam) => {
        this.exams.update(exams => 
          exams.map(e => e.id === updatedExam.id ? updatedExam : e)
        );
        this.editingExam.set(null);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao atualizar prova/trabalho:', error);
        this.isLoading.set(false);
      }
    });
  }

  deleteExam(id: string): void {
    if (!confirm('Tem certeza que deseja excluir esta prova/trabalho?')) return;

    this.isLoading.set(true);
    this.studyManagerService.deleteExam(id).subscribe({
      next: () => {
        this.exams.update(exams => exams.filter(e => e.id !== id));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao excluir prova/trabalho:', error);
        this.isLoading.set(false);
      }
    });
  }

  startEdit(exam: Exam): void {
    this.editingExam.set({ ...exam });
  }

  cancelEdit(): void {
    this.editingExam.set(null);
  }

  resetForm(): void {
    this.newExam = {
      subject_id: '',
      title: '',
      description: '',
      due_date: '',
      type: 'exam'
    };
    this.showCreateForm.set(false);
  }

  getSubjectName(subjectId: string): string {
    const subject = this.subjects().find(s => s.id === subjectId);
    return subject ? subject.name : 'Matéria não encontrada';
  }

  getTypeLabel(type: string): string {
    const typeObj = this.examTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  getStatusLabel(status: string): string {
    const statusObj = this.statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  isOverdue(exam: Exam): boolean {
    if (exam.status === 'completed') return false;
    return new Date(exam.due_date) < new Date();
  }
}
