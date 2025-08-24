import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyManagerService } from '../../../services/study-manager.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  stats = {
    studyPlans: 0,
    notes: 0,
    bibliography: 0,
    files: 0
  };

  constructor(private studyManagerService: StudyManagerService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Aqui você pode carregar estatísticas reais do backend
    // Por enquanto, vamos usar dados mockados
    this.stats = {
      studyPlans: 5,
      notes: 12,
      bibliography: 8,
      files: 15
    };
  }
}
