import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-study-plans',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder">
      <h2>Planos de Estudo</h2>
      <p>Funcionalidade em desenvolvimento...</p>
    </div>
  `,
  styles: [`
    .placeholder {
      text-align: center;
      padding: 48px;
      color: #64748b;
    }
    h2 {
      color: #1e293b;
      margin-bottom: 16px;
    }
  `]
})
export class StudyPlansComponent {}
