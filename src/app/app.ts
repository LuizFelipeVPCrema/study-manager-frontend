import { Component, signal, ErrorHandler, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Study Manager');

  constructor() {
    // Tratamento global de erros
    window.addEventListener('error', (event) => {
      console.error('Erro global capturado:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Promise rejeitada não tratada:', event.reason);
    });
  }
}
