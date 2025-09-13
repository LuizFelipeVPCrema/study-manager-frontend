import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyManagerService, Subject, Exam, StudyContent, Attachment, ExamReference } from '../../../services/study-manager.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  stats = signal({
    subjects: 0,
    exams: 0,
    studyContents: 0,
    attachments: 0,
    references: 0,
    completedContents: 0,
    pendingExams: 0
  });

  recentSubjects = signal<Subject[]>([]);
  upcomingExams = signal<Exam[]>([]);
  isLoading = signal(false);

  constructor(private studyManagerService: StudyManagerService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    
    // Carregar todas as estatísticas em paralelo
    Promise.all([
      this.studyManagerService.getSubjects().toPromise(),
      this.studyManagerService.getExams().toPromise(),
      this.studyManagerService.getStudyContentsBySubject('').toPromise().catch(() => []),
      this.studyManagerService.getAttachmentsByExam('').toPromise().catch(() => []),
      this.studyManagerService.getReferencesByExam('').toPromise().catch(() => [])
    ]).then(([subjects, exams, studyContents, attachments, references]) => {
      const subjectsData = subjects || [];
      const examsData = exams || [];
      const studyContentsData = studyContents || [];
      const attachmentsData = attachments || [];
      const referencesData = references || [];

      // Calcular estatísticas
      const completedContents = studyContentsData.filter(content => content.is_completed).length;
      const pendingExams = examsData.filter(exam => exam.status === 'pending').length;

      this.stats.set({
        subjects: subjectsData.length,
        exams: examsData.length,
        studyContents: studyContentsData.length,
        attachments: attachmentsData.length,
        references: referencesData.length,
        completedContents,
        pendingExams
      });

      // Carregar dados recentes
      this.recentSubjects.set(subjectsData.slice(0, 5));
      this.upcomingExams.set(
        examsData
          .filter(exam => exam.status === 'pending')
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
          .slice(0, 5)
      );

      this.isLoading.set(false);
    }).catch(error => {
      console.error('Erro ao carregar estatísticas:', error);
      this.isLoading.set(false);
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Progresso';
      case 'pending': return 'Pendente';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
